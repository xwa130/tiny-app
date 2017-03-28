module.exports = () => {
  // urlDatabase example:
  //    urlDatabase = {
  //      randomUserName: {shor: long}
  //    }
  let urlDatabase = {};

  // userDatabase example:
  //  userDatabase = {
  //   randomUserName: {
  //     id: randomeUserName,
  //     email: ,
  //     password:
  //   },
  //   ...
  //  }
  let userDatabase = {};

  return [urlDatabase, userDatabase];
}
