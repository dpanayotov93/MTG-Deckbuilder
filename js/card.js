function buildCard() {
    var module = (function() {
        var card = (function() {
            var card = Object.create({});

            Object.defineProperty(card, 'init', {
                value: function(name) {
                    this.name = name;
                    this._id = this.getId(name);
                    this._oracle = this.getOracle(name);
                    this._art = 'http://api.mtgdb.info/content/hi_res_card_images/' + this.id + '.jpg';
                    // this.mana = this.getMana(id);
                    return this;
                }
            });

            Object.defineProperty(card, 'name', {
                get: function() {
                    return this._name;
                },
                set: function(val) {
                    this._name = val;
                }
            });

            Object.defineProperty(card, 'id', {
                get: function() {
                    return this._id;
                }
            });

            Object.defineProperty(card, 'oracle', {
                get: function() {
                    return this._oracle;
                }
            });

            Object.defineProperty(card, 'art', {
                get: function() {
                    return this._art;
                }
            });

            Object.defineProperty(card, 'getId', {
                value: function(name) {
                    var cardName = httpGet('http://api.mtgdb.info/cards/' + name);
                    var result = cardName.match("id\":(.*),\"relatedCardId");
                    return result[1];
                }
            });

            Object.defineProperty(card, 'getOracle', {
                value: function(name) {
                    var cardName = httpGet('http://api.mtgdb.info/cards/' + name);
                    var result = cardName.match("description\":\"(.*?)\",\"flavor");
                    return result[1];
                    // return result.toString().substring(14).slice(0, -129);
                }
            });

            return card;
        }());
        return {
            create: function(name) {
                return Object.create(card).init(name);
            }
        };
    }());
    return module;
}

var module = buildCard();
var test = module.create('Phalanx Leader');
console.log(test.name + ' | ' + test.id + ' | ' + test.oracle + ' | ' + test.art);