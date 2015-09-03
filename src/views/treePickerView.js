define(function (require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var sweetAlert = require("sweetalert");
    var template = require("./text!./treePickerView.html");

    var View = Backbone.View.extend({

        template: _.template(template),

        initialize: function(options) {
            this.options = options || {};
            this.options.viewName = "TreePickerView";
            this.items = options.items;
            this.onSelect = options.onSelect;
            this.openChoiceTree = options.openChoiceTree;
            if (!this.openChoiceTree) {
                throw new Error("openChoiceTree not specified");
            }
        },

        render: function() {
            this.$el.html(this.template({ items: this.items.toJSON() }));
            this.titleView = this.items.getName();
            this.$el.show();
            return this;
        },

        events:{
            "click .edit-button": "edit",
            "click .back-button": "back",
            "click .add": "add",
            "click ul": "select"
        },

        select: function(ev) {
            console.log("select");
            ev.preventDefault();

            var el = ev.target;
            var itemId;
            while (true) {
                console.log("checking ", el);
                if (!el || el.tagName === 'ul') {
                    console.log("nop " + el);
                    return false;
                }
                itemId = el.getAttribute("item-id");
                if (itemId) {
                    console.log("found " + itemId);
                    break;
                }
                el = el.parentElement;
            }

            console.log("select " + itemId);

            // The "delete" button was clicked, delete the item.
            if (ev.target.className.indexOf('delete') >= 0) {
                this.deleteItem(itemId);
                return false;
            }

            var child = this.items.subtree.get(itemId);
            if (child.subtree) {
                this.openChoiceTree(child, this.onSelect);
            }
            else {
                this.onSelect(child.getName());
                this.$el.hide();
            }
            return false;
        },

        deleteItem: function(id) {
            var that = this;
            this.promptConfirmDelete(function(isConfirmed) {
                if (isConfirmed) {
                    that.items.removeChild(id);
                    that.render();
                }
            });
        },
        
        add: function(ev) {
            ev.preventDefault();
            var that = this;
            this.promptDescriptif(function(name) {
                if (name) {
                    that.promptIsMenu(function(isMenu) {
                        that.items.addChild(name, isMenu);
                        that.render();
                    });
                }
            });
            return false;
        },

        edit: function(ev) {
            ev.preventDefault();
            var editButton = this.$(".treepicker-header .edit-button");
            if(editButton.hasClass("edit-mode")){
                editButton.removeClass("edit-mode");
                editButton.addClass("done-mode");
                editButton.html("Terminer");
                this.$(".item-list-name .delete-icon").removeClass("hidden");
                this.$(".item-list-name").addClass("item-list-name-editable");
            }
            else {
                editButton.removeClass("done-mode");
                editButton.addClass("edit-mode");
                editButton.html("Editer");
                this.$(".item-list-name .delete-icon").addClass("hidden");
                this.$(".item-list-name").removeClass("item-list-name-editable");
            }
            return false;
        },

        back: function(ev) {
            ev.preventDefault();
            this.goBack();
            return false;
        },

        goBack: function(){
            if (this.items.parent) {
                this.openChoiceTree(this.items.parent, this.onSelect);
            }
            else {
                this.$el.hide();
            }
        },

        promptDescriptif: function(callback) {
            sweetAlert({
                title: "Nouvelle option",
                text: "Veuillez entrer un descriptif :",
                type: 'input',
                showCancelButton: true,
                closeOnConfirm: false,
                confirmButtonText: "Suivant",
                confirmButtonColor: "#3885c1",
                cancelButtonText: "Annuler",
                animation: "slide-from-top"
            }, callback);
        },

        promptIsMenu: function(callback) {
            sweetAlert({
                title: "Nouvelle option",
                text: "S'agit t'il d'un sous-menu ?",
                showCancelButton: true,
                closeOnConfirm: true,
                closeOnCancel: true,
                confirmButtonText: "Oui",
                confirmButtonColor: "#3885c1",
                cancelButtonText: "Non",
                cancelButtonColor: "#3885c1",
                animation: "slide-from-top"
            }, callback);
        },

        promptConfirmDelete: function(callback) {
            sweetAlert({
                title: "Supprimer l'option",
                text: "Êtes-vous certain de vouloir supprimer cette option ?",
                showCancelButton: true,
                closeOnConfirm: true,
                closeOnCancel: true,
                confirmButtonText: "Supprimer",
                confirmButtonColor: "#3885c1",
                cancelButtonText: "Annuler",
                cancelButtonColor: "#3885c1",
                animation: "slide-from-top"
            }, callback);
        }
    });

    return View;
});
