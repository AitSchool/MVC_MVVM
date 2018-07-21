(function () {
  'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var Model = function () {
    function Model(data) {
      classCallCheck(this, Model);

      this.data = data;
      this.subscribers = [];
    }

    createClass(Model, [{
      key: 'publish',
      value: function publish(data) {
        this.subscribers.forEach(function (callback) {
          return callback(data);
        });
      }
    }]);
    return Model;
  }();

  var Controller = function () {
    function Controller(conf) {
      var _this = this;

      classCallCheck(this, Controller);

      this.el = document.querySelector(conf.el);
      this.model = conf.model;
      this.view = conf.view;
      this.render = this.render.bind(this);
      this.el.addEventListener('click', function (e) {
        e.stopPropagation();
        var rules = Object.keys(conf.onClick || {});
        rules.forEach(function (rule) {
          if (e.path[0].matches(rule)) conf.onClick[rule].call(_this, e);
        });
      });
    }

    createClass(Controller, [{
      key: 'getTargetAttr',
      value: function getTargetAttr(e, attr) {
        return e.path[0].getAttribute(attr);
      }
    }, {
      key: 'getChild',
      value: function getChild(selector) {
        return this.el.querySelector(selector);
      }
    }, {
      key: 'render',
      value: function render() {
        this.el.innerHTML = this.view(this.model);
      }
    }]);
    return Controller;
  }();

  var TodoModel = function (_Model) {
    inherits(TodoModel, _Model);

    function TodoModel() {
      classCallCheck(this, TodoModel);
      return possibleConstructorReturn(this, (TodoModel.__proto__ || Object.getPrototypeOf(TodoModel)).call(this, { todos: [] }));
    }

    createClass(TodoModel, [{
      key: 'todos',
      get: function get$$1() {
        return this.data.todos;
      },
      set: function set$$1(todos) {
        this.data.todos = todos;
        this.publish(todos);
      }
    }]);
    return TodoModel;
  }(Model);

  var TodoController = function (_Controller) {
    inherits(TodoController, _Controller);

    function TodoController(model, view) {
      classCallCheck(this, TodoController);

      // 订阅 Model 更新事件
      var _this = possibleConstructorReturn(this, (TodoController.__proto__ || Object.getPrototypeOf(TodoController)).call(this, {
        model: model,
        view: view,
        el: '#app',
        onClick: {
          '.btn-add': function btnAdd() {
            // 新增 Todo 时对数据全量赋值
            this.model.todos = this.model.todos.concat([{
              id: new Date().getTime().toString(),
              // 使用 getter 获取绑定至 DOM 元素的数据
              text: this.addInputText
            }]);
          },
          '.btn-delete': function btnDelete(e) {
            var id = this.getTargetAttr(e, 'data-id');
            // 根据 id 过滤掉待删除元素
            this.model.todos = this.model.todos.filter(function (todo) {
              return todo.id !== id;
            });
          },
          '.btn-update': function btnUpdate(e) {
            var id = this.getTargetAttr(e, 'data-id');
            var text = this.getUpdateText(id);
            // 根据 id 更新元素
            this.model.todos = this.model.todos.map(function (todo) {
              return {
                id: todo.id,
                text: todo.id === id ? text : todo.text
              };
            });
          }
        }
      }));

      _this.model.subscribers.push(_this.render);
      return _this;
    }

    createClass(TodoController, [{
      key: 'getUpdateText',
      value: function getUpdateText(id) {
        return get(TodoController.prototype.__proto__ || Object.getPrototypeOf(TodoController.prototype), 'getChild', this).call(this, 'input[data-id="' + id + '"]').value;
      }
    }, {
      key: 'addInputText',
      get: function get$$1() {
        return get(TodoController.prototype.__proto__ || Object.getPrototypeOf(TodoController.prototype), 'getChild', this).call(this, '.input-add').value;
      }
    }]);
    return TodoController;
  }(Controller);

  function TodoView(_ref) {
    var todos = _ref.todos;

    var todosList = todos.map(function (todo) {
      return '\n    <div>\n      <span>' + todo.text + '</span>\n      <button data-id="' + todo.id + '" class="btn-delete">\n        Delete\n      </button>\n\n      <span>\n        <input data-id="' + todo.id + '"/>\n        <button data-id="' + todo.id + '" class="btn-update">\n          Update\n        </button>\n      </span>\n    </div>\n  ';
    }).join('');

    return '\n    <main>\n      <input class="input-add"/>\n      <button class="btn-add">Add</button>\n      <div>' + todosList + '</div>\n    </main>\n  ';
  }

  var model = new TodoModel();
  var controller = new TodoController(model, TodoView);
  controller.render();

}());
