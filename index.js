"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var parametersFormEl = document.querySelector('#parameters-form');
var boredItemsList = document.querySelector('#bored-items-list');
var allInputButtonEls = Array.from(document.querySelectorAll('input[type="button"]'));
var navActivitiesButtonEl = document.querySelector('#nav-activities');
var navTodoButtonEl = document.querySelector('#nav-todo');
var navGraphButtonEl = document.querySelector('#nav-graph');
var taskListEl = document.querySelector('#task-list');
var chartEl = document.querySelector('#chart');
var chart = chartEl.getContext('2d');
var myChart;
var Api = /** @class */ (function () {
    function Api() {
    }
    Api.prototype.fetchActivity = function (filterObject) {
        return __awaiter(this, void 0, void 0, function () {
            var typeString, participantsString, priceString, fetchString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        typeString = '';
                        participantsString = '';
                        priceString = '';
                        if (filterObject.type) {
                            typeString = "type=" + filterObject.type;
                        }
                        if (filterObject.participants) {
                            participantsString = "participants=" + filterObject.participants;
                        }
                        if (filterObject.price || filterObject.price === 0) {
                            priceString = "maxprice=" + filterObject.price;
                        }
                        fetchString = "http://www.boredapi.com/api/activity?" + typeString + "&" + participantsString + "&" + priceString;
                        console.log(fetchString);
                        return [4 /*yield*/, fetch(fetchString)
                                .then(function (res) { return res.json(); })
                                .then(function (res) {
                                return res;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Api;
}());
var BoredItems = /** @class */ (function () {
    function BoredItems() {
    }
    BoredItems.prototype.addItem = function (item) {
        BoredItems.boredItemsList.push(item);
    };
    BoredItems.prototype.clearBoredItems = function () {
        BoredItems.boredItemsList = [];
    };
    BoredItems.boredItemsList = [];
    return BoredItems;
}());
var Tasks = /** @class */ (function () {
    function Tasks() {
    }
    Tasks.prototype.addTask = function (activity) {
        var task = __assign(__assign({}, activity), { status: 'new' });
        Tasks.tasksListItems.push(task);
        localStorage.setItem('task-list', JSON.stringify(Tasks.tasksListItems));
    };
    Tasks.prototype.markTaskDone = function (task) {
        var taskIndex = Tasks.tasksListItems.findIndex(function (_task) { return _task.key === task.key; });
        Tasks.tasksListItems[taskIndex].status = 'done';
        localStorage.setItem('task-list', JSON.stringify(Tasks.tasksListItems));
        var render = new Render();
        render.clearTaskList();
        render.renderAllTasks();
    };
    Tasks.prototype.markTaskNew = function (task) {
        var taskIndex = Tasks.tasksListItems.findIndex(function (_task) { return _task.key === task.key; });
        Tasks.tasksListItems[taskIndex].status = 'new';
        localStorage.setItem('task-list', JSON.stringify(Tasks.tasksListItems));
        var render = new Render();
        render.clearTaskList();
        render.renderAllTasks();
    };
    // Fetching the tasks from localstorage if there are any present
    Tasks.tasksListItems = JSON.parse(localStorage.getItem('task-list'))
        ? JSON.parse(localStorage.getItem('task-list'))
        : [];
    return Tasks;
}());
var Render = /** @class */ (function () {
    function Render() {
    }
    Render.prototype.removeAllBoredItemsFromList = function () {
        var boredItems = new BoredItems();
        boredItems.clearBoredItems();
        if (boredItemsList)
            boredItemsList.innerHTML = '';
    };
    Render.prototype.createErrorElement = function (error) {
        var liEl = document.createElement('li');
        liEl.classList.add('bored-item');
        liEl.textContent = error.error;
        return liEl;
    };
    Render.prototype.createBoredItemElement = function (activity) {
        var newLiEl = document.createElement('li');
        var typePEl = document.createElement('p');
        var activityParagraphEl = document.createElement('p');
        var saveForLaterButtonEl = document.createElement('button');
        activityParagraphEl.textContent = activity.activity;
        activityParagraphEl.classList.add('activity-paragraph');
        typePEl.textContent = activity.type;
        saveForLaterButtonEl.textContent = 'Save for later';
        saveForLaterButtonEl.addEventListener('click', function () {
            var tasks = new Tasks();
            tasks.addTask(activity);
        });
        newLiEl.classList.add('bored-item');
        newLiEl.append(activityParagraphEl);
        newLiEl.append(typePEl);
        newLiEl.append(saveForLaterButtonEl);
        return newLiEl;
    };
    /**
     * Fetches and renders 10 boredItems
     * @param filterObject {type: object, type: string, participants: number, price: number}
     */
    Render.prototype.renderTenBoredItems = function (filterObject) {
        return __awaiter(this, void 0, void 0, function () {
            var boredItems, api, runCheck, _loop_1, this_1, out_i_1, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        boredItems = new BoredItems();
                        api = new Api();
                        runCheck = 5;
                        _loop_1 = function (i) {
                            var activity, doubleItemCheck, taskDoubleItemCheck, newLiEl, boredItemsList_1;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, api.fetchActivity(filterObject)];
                                    case 1:
                                        activity = _b.sent();
                                        doubleItemCheck = BoredItems.boredItemsList.findIndex(function (boredItem) { return boredItem.key === activity.key; });
                                        taskDoubleItemCheck = Tasks.tasksListItems.findIndex(function (taskItem) { return taskItem.key === activity.key; });
                                        if (doubleItemCheck >= 0 || taskDoubleItemCheck >= 0) {
                                            runCheck--;
                                            i--;
                                            if (runCheck === 0)
                                                i = 10;
                                        }
                                        else {
                                            runCheck = 5;
                                            boredItems.addItem(activity);
                                            newLiEl = void 0;
                                            if (activity.error) {
                                                newLiEl = this_1.createErrorElement(activity);
                                                i = 10;
                                            }
                                            else {
                                                newLiEl = this_1.createBoredItemElement(activity);
                                            }
                                            boredItemsList_1 = document.querySelector('#bored-items-list');
                                            boredItemsList_1 === null || boredItemsList_1 === void 0 ? void 0 : boredItemsList_1.appendChild(newLiEl);
                                        }
                                        out_i_1 = i;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < 10)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(i)];
                    case 2:
                        _a.sent();
                        i = out_i_1;
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Render.prototype.clearTaskList = function () {
        taskListEl.innerHTML = '';
    };
    Render.prototype.createNewTaskElement = function (task) {
        var newLiEl = document.createElement('li');
        var taskNameEl = document.createElement('p');
        var taskTypeEl = document.createElement('p');
        var checkboxSpanEl = document.createElement('span');
        newLiEl.classList.add('task');
        taskTypeEl.classList.add('task-type');
        taskNameEl.classList.add('task-name');
        checkboxSpanEl.classList.add('checkbox');
        checkboxSpanEl.addEventListener('click', function () {
            var tasks = new Tasks();
            tasks.markTaskDone(task);
        });
        // First letter to uppercase
        var typeString = task.type.charAt(0).toUpperCase() + task.type.slice(1);
        taskNameEl.textContent = task.activity;
        taskTypeEl.textContent = typeString;
        newLiEl.append(taskNameEl);
        newLiEl.append(taskTypeEl);
        newLiEl.append(checkboxSpanEl);
        return newLiEl;
    };
    Render.prototype.createDoneTaskElement = function (task) {
        var newLiEl = document.createElement('li');
        var taskNameEl = document.createElement('p');
        var taskTypeEl = document.createElement('p');
        var checkboxSpanEl = document.createElement('span');
        var checkImageEl = document.createElement('img');
        newLiEl.classList.add('task');
        taskTypeEl.classList.add('task-type');
        taskNameEl.classList.add('task-name');
        checkboxSpanEl.classList.add('checkbox');
        checkboxSpanEl.classList.add('checked');
        checkImageEl.setAttribute('src', './assets/check-mark.png');
        checkImageEl.setAttribute('alt', 'Check');
        checkboxSpanEl.append(checkImageEl);
        checkboxSpanEl.addEventListener('click', function () {
            var tasks = new Tasks();
            tasks.markTaskNew(task);
        });
        // First letter to uppercase
        var typeString = task.type.charAt(0).toUpperCase() + task.type.slice(1);
        taskNameEl.textContent = task.activity;
        taskTypeEl.textContent = typeString;
        newLiEl.append(taskNameEl);
        newLiEl.append(taskTypeEl);
        newLiEl.append(checkboxSpanEl);
        return newLiEl;
    };
    Render.prototype.renderAllTasks = function () {
        var _this = this;
        Tasks.tasksListItems.forEach(function (task) {
            var newLiEl;
            if (task.status === 'new') {
                newLiEl = _this.createNewTaskElement(task);
            }
            if (newLiEl) {
                taskListEl.append(newLiEl);
            }
        });
        Tasks.tasksListItems.forEach(function (task) {
            var newLiEl;
            if (task.status === 'done') {
                newLiEl = _this.createDoneTaskElement(task);
            }
            if (newLiEl) {
                taskListEl.append(newLiEl);
            }
        });
    };
    Render.prototype.renderBoredView = function () {
        navActivitiesButtonEl === null || navActivitiesButtonEl === void 0 ? void 0 : navActivitiesButtonEl.classList.add('nav-active');
        navGraphButtonEl === null || navGraphButtonEl === void 0 ? void 0 : navGraphButtonEl.classList.remove('nav-active');
        navTodoButtonEl === null || navTodoButtonEl === void 0 ? void 0 : navTodoButtonEl.classList.remove('nav-active');
        parametersFormEl.style.display = 'flex';
        boredItemsList.style.display = 'grid';
        chartEl.style.display = 'none';
        taskListEl.style.display = 'none';
    };
    Render.prototype.renderTodoView = function () {
        navTodoButtonEl === null || navTodoButtonEl === void 0 ? void 0 : navTodoButtonEl.classList.add('nav-active');
        navGraphButtonEl === null || navGraphButtonEl === void 0 ? void 0 : navGraphButtonEl.classList.remove('nav-active');
        navActivitiesButtonEl === null || navActivitiesButtonEl === void 0 ? void 0 : navActivitiesButtonEl.classList.remove('nav-active');
        parametersFormEl.style.display = 'none';
        boredItemsList.style.display = 'none';
        chartEl.style.display = 'none';
        taskListEl.style.display = 'grid';
        this.clearTaskList();
        this.renderAllTasks();
    };
    Render.prototype.renderGraphView = function () {
        navGraphButtonEl === null || navGraphButtonEl === void 0 ? void 0 : navGraphButtonEl.classList.add('nav-active');
        navTodoButtonEl === null || navTodoButtonEl === void 0 ? void 0 : navTodoButtonEl.classList.remove('nav-active');
        navActivitiesButtonEl === null || navActivitiesButtonEl === void 0 ? void 0 : navActivitiesButtonEl.classList.remove('nav-active');
        parametersFormEl.style.display = 'none';
        boredItemsList.style.display = 'none';
        taskListEl.style.display = 'none';
        chartEl.style.display = 'block';
        var doneTasks = [];
        var labels = [];
        var data = [];
        Tasks.tasksListItems.forEach(function (task) {
            if (task.status === 'done') {
                doneTasks.push(task);
            }
            else {
                if (labels.length === 1) {
                    data[0] = data[0] + 1;
                }
                else {
                    labels[0] = 'Unfinished';
                    data[0] = 1;
                }
            }
        });
        doneTasks.forEach(function (task) {
            var foundDoubleIndex = labels.findIndex(function (label) { return label === task.type; });
            if (foundDoubleIndex !== -1) {
                data[foundDoubleIndex] = data[foundDoubleIndex] + 1;
            }
            else {
                labels.push(task.type);
                data.push(1);
            }
        });
        if (myChart)
            myChart.destroy();
        myChart = new Chart(chart, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '# of Completed',
                        data: data,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };
    return Render;
}());
var Filter = /** @class */ (function () {
    function Filter() {
    }
    Filter.prototype.returnInputValues = function () {
        var typeSelectEl = document.querySelector('#type-select');
        var participantsInputEl = document.querySelector('#participants-input');
        var priceSliderEl = document.querySelector('#price-slider');
        var type = typeSelectEl.value;
        var participants = +participantsInputEl.value;
        var price = +priceSliderEl.value / 100;
        return {
            type: type,
            participants: participants,
            price: price
        };
    };
    return Filter;
}());
var Init = /** @class */ (function () {
    function Init() {
    }
    return Init;
}());
var init = new Init();
allInputButtonEls.forEach(function (inputButtonEl) {
    inputButtonEl.addEventListener('click', function (event) {
        var element = event.target;
        var render = new Render();
        if (element.value === 'Activities') {
            render.renderBoredView();
        }
        else if (element.value === 'Todo') {
            render.renderTodoView();
        }
        else if (element.value === 'Graph') {
            render.renderGraphView();
        }
    });
});
parametersFormEl.addEventListener('submit', function (e) {
    e.preventDefault();
    var filter = new Filter();
    var filterValues = filter.returnInputValues();
    var render = new Render();
    boredItemsList.style.display = 'grid';
    render.removeAllBoredItemsFromList();
    render.renderTenBoredItems(filterValues);
});
