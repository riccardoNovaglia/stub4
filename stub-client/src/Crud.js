class CrudBuilder {
  constructor() {
    this.idAlias = 'id';
    this.patchOnPost = false;
  }
  withIdAlias(idAlias) {
    this.idAlias = idAlias;
    return this;
  }
  withPatchOnPost(patchOnPost) {
    this.patchOnPost = patchOnPost;
    return this;
  }

  toJson() {
    return {
      crud: {
        idAlias: this.idAlias,
        patchOnPost: this.patchOnPost
      }
    };
  }
}

function containsCrud() {
  return new CrudBuilder();
}

module.exports = { containsCrud };
