const Sequelize = require("sequelize");
var sequelize = new Sequelize(
  "uwvrxvoy",
  "uwvrxvoy",
  "IHZ7NqY7MW8k3yx4Nbq2mggA6P6vLWPn",
  {
    host: "suleiman.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

var Art = sequelize.define("Article", {
  content: Sequelize.STRING,
  title: Sequelize.STRING,
  date: Sequelize.STRING,
  content: Sequelize.STRING,
  image: Sequelize.STRING,
});

exports.initilaize = function () {
  return new Promise(function (resolve, reject) {
    sequelize
      .sync()
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("unable to sync the database");
      });
  });
};

exports.getAllArticles = function () {
  return new Promise(function (resolve, reject) {
    Art.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no articles");
      });
  });
};

exports.getPublishedArticles = function () {
  return new Promise(function (resolve, reject) {
    Art.findAll({
      where: {
        published: true,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no articles");
      });
  });
};

exports.getArticlesById = function (id) {
  return new Promise(function (resolve, reject) {
    Art.findAll({
      where: {
        id: id,
      },
    })
      .then((data) => {
        resolve(data[0]);
      })
      .catch((err) => {
        reject("no articles");
      });
  });
};

exports.addArticle = (ArticleData) => {
  return new Promise((resolve, reject) => {
    if (ArticleData.published) {
      ArticleData.published = true;
    } else {
      ArticleData.published = false;
    }
    for (var prop in ArticleData) {
      if (ArticleData[prop] == "") postData[prop] = null;
    }
    ArticleData.ArticleDate = new Date();
    Art.create(ArticleData)
      .then(() => {
        console.log("i am here");
        resolve();
      })
      .catch(() => {
        reject("Unable to add Article");
      });
  });
};

exports.updateArticle = (ArticleData) => {
  return new Promise((resolve, reject) => {
    if (ArticleData.published) {
      ArticleData.published = true;
    } else {
      ArticleData.published = false;
    }
    for (var prop in ArticleData) {
      if (ArticleData[prop] == "") postData[prop] = null;
    }
    Art.update(ArticleData, { where: { id: ArticleData.id } })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("Unable to update Article");
      });
  });
};


exports.getAllArticlesByMinDate = (minDateStr) => {
  return new Promise((resolve, reject) => {
    Art.findAll({
      where: {
        ArticleDate: {
          [Op.gt]: minDateStr,
        },
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no articles");
      });
  });
};

exports.getAllArticlesByMaxDate = (maxDateStr) => {
  return new Promise((resolve, reject) => {
    Art.findAll({
      where: {
        ArticleDate: {
          [Op.lt]: maxDateStr,
        },
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no articles");
      });
  });
};

exports.deleteArticleById = (id) => {
  return new Promise((resolve, reject) => {
    Art.destroy({ where: { id: id } })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("Unable to delete Article");
      });
  });
};

exports.updateArticleById = (ArticleData) => {
  return new Promise((resolve, reject) => {
    if (ArticleData.published) {
      ArticleData.published = true;
    } else {
      ArticleData.published = false;
    }
    for (var prop in ArticleData) {
      if (ArticleData[prop] == "") postData[prop] = null;
    }
    Art.update(ArticleData, { where: { id: ArticleData.id } })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("Unable to update Article");
      });
  });
};

exports.createArticle = (ArticleData) => {
  return new Promise((resolve, reject) => {
    if (ArticleData.published) {
      ArticleData.published = true;
    } else {
      ArticleData.published = false;
    }
    for (var prop in ArticleData) {
      if (ArticleData[prop] == "") postData[prop] = null;
    }
    ArticleData.ArticleDate = new Date();
    Art.create(ArticleData)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("Unable to create Article");
      });
  });
};

exports.editArticle = (ArticleData) => {
  return new Promise((resolve, reject) => {
    if (ArticleData.published) {
      ArticleData.published = true;
    } else {
      ArticleData.published = false;
    }
    for (var prop in ArticleData) {
      if (ArticleData[prop] == "") postData[prop] = null;
    }
    Art.update(ArticleData, { where: { id: ArticleData.id } })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("Unable to update Article");
      });
  });
};

exports.logout = (req, res) => {
  req.session.reset();
  res.redirect("/");
};
