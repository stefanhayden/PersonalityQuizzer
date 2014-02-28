var PersonalityQuizer =(function($, DOMBars, window, document){
	'use strict';

	var Model = function(options) {

		var model = function(data) {
			this.data = data || {};

			this.on("change:$el", function(e, v){ 
				
			});

		};

		/* Mixin Class */
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
	
	var quizModel = Model();
	var questionModel = Model();
	var answerModel = Model({
		events: {
			"click .answer": function(e) {

				console.log(e.data.model.get("score"))
			}
		}
	});
	var resultModel = Model();

	DOMBars.registerHelper('outlet', function actionHelper(name) {
		var models = this.get(name);
		if(models) {
			var el = document.createElement("div");
			$.each(models, function(i,v){
				var t = $("<div />").append(v.get("$el"));

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

	function checkResult() {
		var questions = $(element).find(".question").length;
		var selected = $(element).find(".question").filter(function(){
			return typeof $(this).data("result") !== "undefined";
		}).length;

		if(questions === selected) {
			$(element).unbind("click.quiz");
			setResult();
		}
	}

	function setResult() {
		var results = [];
		$(element).find(".result").each(function(){
			var result = $(this).data("final-result");
			var selected = $(element).find(".question").filter(function(){
				return $(this).data("result") == result;
			}).length
			results.push([ $(this).data("final-result"), selected ])
		})
		results.sort(function(a, b) {
			return b[1] - a[1]
		});
		
		var final_result = $(element).find(".result").filter(function(){
			return $(this).data("final-result") == results[0][0];
		});

		if(final_result.length) {
			final_result.show()
		}

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

		// $(element).on("click.quiz",".answer", function(){
		// 	var question = $(this).parents(".question")
		// 	$(question).find(".answer").removeClass("selected");
		// 	$(question).data("result", $(this).data("result"));
		// 	$(this).addClass("selected");
		// 	checkResult();
		// });

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
	}

	out.prototype.quiz_data = quiz;

	out.prototype.setTitle = function(title) {
		quiz.set("title", title);
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
			a.set("$el",templates.answer(a))
			answers.push(a)
		})
		if(question.answers && settings.shuffle) {
			shuffle(answers)
		}
		question.answers = answers;
		var questions = quiz.get("questions");
		var q = new questionModel(question);
		q.set("$el", templates.question(q));
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
		r.set("$el", templates.result(r));
		results.push(r);
		quiz.set("results",results)
		queueRender();
	}

	out.prototype.render = function() {
		queueRender.call(this);		
	}


	return out;


})(jQuery, DOMBars, window, document);
