define(function (require) {

    var Backbone = require('backbone');
    var uuid = require('./uuid');
    var debug = require('../debug');

    var Choice = function(parent, attributes, model) {
        this.init(parent, attributes, model);
    };

    Choice.prototype.initFromPath = function(path, model) {
        if (model.attributes.id !== path[0]) {
            debug.error("Invalid path");
            return;
        }
        var c = new Choice(null, model.attributes, model);
        for (var i = 1; i < path.length; ++i) {
            c = c.subtree.get(path[i]);
            if (!c) {
                debug.error("Invalid path");
                return;
            }
        }
        this.parent = c.parent;
        this.attributes = c.attributes;
        this.subtree = c.subtree;
        this.model = c.model;
    };

    Choice.prototype.init = function(parent, attributes, model) {
        this.parent = parent;
        this.attributes = attributes;
        if (typeof this.attributes.subtree !== "undefined") {
            this.subtree = new SubTree(this, attributes.subtree);
        }
        this.model = model;
    };

    Choice.prototype.path = function() {
        if (!this.parent) {
            return [ this.attributes.id ];
        }
        var ret = this.parent.path();
        ret.push(this.attributes.id);
        return ret;
    };

    Choice.prototype.getName = function() {
        return this.attributes.name;
    };

    Choice.prototype.addChild = function(name, hasSubtree) {
        var child = {
            id: uuid(),
            name: name
        };
        if (hasSubtree) {
            child.subtree = [];
        }
        var path = this.path();
        this.subtree.push(child);
        this.model.save();
        this.initFromPath(path, this.model);
    };

    Choice.prototype.removeChild = function(id) {
        var path = this.path();
        this.subtree.remove(id);
        this.model.save();
        this.initFromPath(path, this.model);
    };

    Choice.prototype.toJSON = function() {
        return this.attributes;
    };

    // Custom collection of choices in form of a tree.
    var SubTree = function(parent, array) {
        this.parent = parent;
        this.array = array;
    };

    SubTree.prototype.toJSON = function() {
        return this.array;
    };

    SubTree.prototype.get = function(id) {
        for (var i = 0; i < this.array.length; ++i) {
            if (this.array[i].id === id) {
                return new Choice(this.parent, this.array[i], this.parent.model);
            }
        }
        return null;
    };

    SubTree.prototype.push = function(child) {
        this.array.push(child);
    };

    SubTree.prototype.remove = function(id) {
        for (var i = 0; i < this.array.length; ++i) {
            if (this.array[i].id === id) {
                this.array.splice(i, 1);
                return;
            }
        }
    };

    /*
    var dummyData = {
        id: "diagnostics",
        name: "Diagnostiques",
        subtree: [{
                id: "1",
                name: "Mal au dos"
            }, {
                id: "2",
                name: "Os cassé"
            }, {
                id: "3",
                name: "Autre",
                subtree: [{
                    id: "3a",
                    name: "RAS"
                }]
            }
        ]
    };
    var c = new Choice(null, dummyData);
    */

    var ChoiceModel = Backbone.Model.extend({
        tree: function() {
            return new Choice(null, this.attributes, this);
        }
    });

    return ChoiceModel;
});
