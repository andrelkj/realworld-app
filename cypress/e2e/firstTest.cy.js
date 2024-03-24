describe("Test with backend", () => {
  beforeEach("login to application", () => {
    cy.intercept({ method: "Get", path: "tags" }, { fixture: "tags.json" });
    cy.loginToApplication();
  });

  it("verify correct request and response", () => {
    // first define what to intercept
    cy.intercept(
      "POST",
      "https://conduit-api.bondaracademy.com/api/articles/"
    ).as("postArticles");

    // and then the action
    cy.contains("New Article").click();
    cy.get('[formcontrolname="title"]').type("This is the title");
    cy.get('[formcontrolname="description"]').type("This is a description");
    cy.get('[formcontrolname="body"]').type("This is a body of the article");
    cy.contains("Publish Article").click();

    // use the request
    cy.wait("@postArticles").then((xhr) => {
      console.log(xhr);
      expect(xhr.response.statusCode).to.equal(201);
      expect(xhr.request.body.article.body).to.equal(
        "This is a body of the article"
      );
      expect(xhr.response.body.article.description).to.equal(
        "This is a description"
      );
    });
  });

  it("intercepting and modifying the request and response", () => {
    // first define what to intercept
    // intercept the post request from articles and change description
    cy.intercept("POST", "**/articles/", (req) => {
      req.body.article.description = "This is the changed description";
    }).as("postArticles");

    // cy.intercept("POST", "**/articles/", (req) => {
    //   req.reply((res) => {
    //     expect(res.body.article.description).to.equal("This is a description");
    //     res.body.article.description = "This is the changed description";
    //   });
    // }).as("postArticles");

    // and then the action
    cy.contains("New Article").click();
    cy.get('[formcontrolname="title"]').type("This is the title");
    cy.get('[formcontrolname="description"]').type("This is a description");
    cy.get('[formcontrolname="body"]').type("This is a body of the article");
    cy.contains("Publish Article").click();

    // use the request
    cy.wait("@postArticles");
    cy.get("@postArticles").then((xhr) => {
      console.log(xhr);
      expect(xhr.response.statusCode).to.equal(201);
      expect(xhr.request.body.article.body).to.equal(
        "This is a body of the article"
      );
      expect(xhr.response.body.article.description).to.equal(
        "This is the changed description"
      );
    });
  });

  it("should gave tags with routing objects", () => {
    cy.get(".tag-list")
      .should("contain", "cypress")
      .and("contain", "automation")
      .and("contain", "testing");
  });

  it("verify global feed likes count", () => {
    cy.intercept("GET", "**/articles/feed*", {
      articles: [],
      articlesCount: 0,
    });
    cy.intercept("GET", "**/articles*", {
      fixture: "articles.json",
    });

    cy.contains("Global Feed").click();
    cy.get("app-article-list button").then((heartList) => {
      expect(heartList[0]).to.contain("1");
      expect(heartList[1]).to.contain("5");
    });

    cy.fixture("articles").then((file) => {
      const articleLink = file.articles[1].slug;
      file.articles[1].favoritesCount = 6;
      cy.intercept("POST", "**/articles/" + articleLink + "/favorite", file);
    });
    cy.get("app-article-list button").eq(1).click().should("contain", "6");
  });

  it("delete new article from the global feed", () => {
    const bodyRequest = {
      article: {
        title: "Title",
        description: "Description",
        body: "Article body",
        tagList: [],
      },
    };

    cy.get("@token").then((token) => {
      cy.request({
        url: "https://conduit-api.bondaracademy.com/api/articles/",
        headers: { Authorization: "Token " + token },
        method: "POST",
        body: bodyRequest,
      }).then((response) => {
        expect(response.status).to.equal(201);
      });

      cy.contains("Global Feed").click();
      cy.get(".preview-link").first().click();
      cy.get(".article-actions").contains("Delete Article").click();

      cy.request({
        url: "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0",
        headers: { Authorization: "Token " + token },
        method: "GET",
      })
        .its("body")
        .then((body) => {
          expect(body.articles[0].title).not.to.equal("Title");
        });
    });
  });
});
