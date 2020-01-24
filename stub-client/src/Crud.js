class CrudBuilder {
  constructor() {
    this.crud = true;
    this.idAlias = 'id';
  }
  withIdAlias(idAlias) {
    this.idAlias = idAlias;
    return this;
  }

  toJson() {
    return {
      idAlias: this.idAlias
    };
  }
}

function containsCrud() {
  return new CrudBuilder();
}

module.exports = { containsCrud };
