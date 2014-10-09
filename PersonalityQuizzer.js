var PersonalityQuizzer = (function($, DOMBars, window, document){
	'use strict';

	var Model = function(options) {
		var options = options || {};

		var model = function(data) {
			this.data = data || {};

			if(options.init) {
				options.init.call(this);
			}

		};

		var Mixin = function(){};
		Mixin.prototype = {
			set: function(key, value) {
				this.data[key] = value;
				$(this).trigger("change:"+key, value);
			},
			get: function(key) {
				return this.data[key];
			},
			on: function(e, f) {
				$(this).on(e, f);
			},
			off: function(e, f) {
				$(this).off(e, f);
			}
		};

		$.extend(model.prototype, Mixin.prototype, options);

		return model;

	}
	
	var quizModel = Model({
		init: function(){
			var _this = this;
			this.on("answered", function(){
				if(_this.checkAnswered()) {
					_this.calculateResult();
				}
			})
		},
		checkAnswered: function() {
			var length = this.get("questions").length;
			var answers = $(this.get("questions")).filter(function(){
				return this.getAnswer();
			}).length;

			return length === answers;
		},
		calculateResult: function() {
			var _this = this;
			var answers = {};
			$.each(this.get("questions"), function(i,v){
				var answer = v.getAnswer();
				var result = answer.get("result");

				if(typeof result == "number") {
					result = [result];
				}

				result.forEach(function(r){
					answers[r] = answers[r] || 0;
					answers[r] += answer.get("score");
				})
			});

			var winnerId;
			var topScore = 0;
			$.each(answers, function(i,v){
				if(v >= topScore) {
					topScore = v;
					winnerId = i;
				}
			})

			if(winnerId) {
				this.showResult(winnerId);
			}

			this.set("done", true)

		},
		showResult: function(resultId) {
			var result = $(this.get("results")).filter(function(){
				return this.get("id") == resultId;
			})[0];
			
			result.set("selected", true);
			var el = result.get("el");
			var elOffset = $(el).offset().top
			var windowHeight = $(window).height();
			var scrollTo = elOffset - (windowHeight / 3);
			
			$(document.body).animate({
				scrollTop: scrollTo
			}, 2000);
		}
	});
	var questionModel = Model({
		init: function() {
			var _this = this;
			this.on("answered", function(){
				$(_this.get("parent")).trigger("answered");
			})
		},
		getAnswer: function() {
			return $(this.get("answers")).filter(function(){
				return this.get("selected");
			})[0];
		}
	});
	var answerModel = Model({
		init: function(){
			if(!this.get("score")) {
				this.set("score", 1);
			}
		},
		events: {
			"click >": function(e) {
				if(!quiz.get("done")) {
					var answers = e.data.model.get("parent").get("answers");
					$.each(answers, function(i,v){
						v.set("selected", false)
					})
					e.data.model.set("selected", true);
					$(e.data.model.get("parent")).trigger("answered");
				}
			}
		}
	});
	var resultModel = Model();

	DOMBars.registerHelper('outlet', function actionHelper(name) {
		var models = this.get(name);
		if(models) {
			var el = document.createElement("div");
			$.each(models, function(i,v){
				var t = v.get("el");

				if(v.events) {
					$.each(v.events, function(ii,vv){
						var breakAt = ii.indexOf(" ");
						var selector = ""
						var eventName = ""
						if(breakAt) {
							eventName = ii.substring(0,breakAt);
							selector = ii.substring(breakAt, ii.length)
						} else {
							eventName = ii;
						}
						$(t).on(eventName, selector, { model: v}, vv)
					});
				}
				$(el).append(t);
			
			});

			return el;
		}
		
		
	});


	var element = $("<div>");
	var quiz = new quizModel({
			title: "",
			questions: [],
			results: []
		});

	var defaults = {
		append: "body",
		quiz_template: "#quiz_template",
		question_template: "#question_template",
		answer_template: "#answer_template",
		result_template: "#result_template",
		shuffle: true,
		debounce: 10,
	}
	var settings = {};

	var templates = {};

	function shuffle(array) {
		var currentIndex = array.length
		, temporaryValue
		, randomIndex
		;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}


	function queueRender() {
		var _this = this;
		if(typeof settings.queueRenderTimeout !== "undefined") {
			clearTimeout(settings.queueRenderTimeout)
		}

		settings.queueRenderTimeout = setTimeout(function(){
			render();
		}, settings.debounce);
	}

	function render() {
		element.find(">").remove();
		var t = templates.quiz(quiz);
		element.append(t);

		$(settings.append).append(element);
	}

	var out = function(data) {
		var data = data || {};
		settings = $.extend( {}, defaults, data.options );

		templates.quiz = DOMBars.compile($(settings.quiz_template).html());
		templates.question = DOMBars.compile($(settings.question_template).html());
		templates.answer = DOMBars.compile($(settings.answer_template).html());
		templates.result = DOMBars.compile($(settings.result_template).html());

    	DOMBars.registerPartial("question", templates.question);
    	DOMBars.registerPartial("answer", templates.answer);
    	DOMBars.registerPartial("result", templates.result);

		DOMBars.get = function (object, property) {
			return object.get(property);
		};
		DOMBars.subscribe = function (object, property, callback) {
			object.on('change:' + property, callback);
		};
		DOMBars.unsubscribe = function (object, property, callback) {
			object.off('change:' + property, callback);
		};

		if(data.questions) {
			quiz.set("questions", data.questions);
		}

		if(data.results) {
			quiz.set("results",data.results);
		}

		if(data.title) {
			quiz.set("title", data.title);
		}

		queueRender();
	}

	out.prototype.addQuestions = function(questions) {
		var _this = this;
		$.each(questions, function(i, v){
			_this.addQuestion(v);
		})
	}
	out.prototype.addQuestion = function(question) {
		var answers = [];
		$.each(question.answers, function(i, v){
			var a = new answerModel(v);
			a.set("el",$("<div />").append(templates.answer(a)))
			answers.push(a)
		})
		if(settings.shuffle) {
			shuffle(answers)
		}
		question.answers = answers;
		var q = new questionModel(question);
		q.set("parent", quiz);

		$.each(q.get("answers"),function(i,v) {
			v.set("parent", q);
		})

		var questions = quiz.get("questions");
		q.set("el", $("<div />").append(templates.question(q)));
		questions.push(q);
		quiz.set("questions", questions);
		queueRender();
	}

	out.prototype.addResults = function(results) {
		var _this = this;
		$.each(results, function(i, v){
			_this.addResult(v);
		})
	}
	out.prototype.addResult = function(result) {	
		var results = quiz.get("results");
		var r = new resultModel(result);
		r.set("el", $("<div />").append(templates.result(r)));
		r.set("parent", quiz);
		results.push(r);
		quiz.set("results",results)
		queueRender();
	}

	out.prototype.render = function() {
		queueRender.call(this);		
	}

	out.prototype.set = function(key, value) {
		quiz.set(key, value);
	}
	out.prototype.get = function(key) {
		quiz.get(key)
	}


	return out;


})(jQuery, DOMBars, window, document);
