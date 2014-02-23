var Quiz =(function($, Handlebars, window, document){
	'use strict';

	var element = $("<div>");
	var quiz = {
		title: "",
		questions: [],
		results: []
	};

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

	var templates = {}

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
		element.append($(templates.quiz(quiz)));

		$(element).on("click.quiz",".answer", function(){
			var question = $(this).parents(".question")
			$(question).find(".answer").removeClass("selected");
			$(question).data("result", $(this).data("result"));
			$(this).addClass("selected");
			checkResult();
		})

		$(settings.append).append(element);
	}

	var out = function(data) {
		var data = data || {};
		settings = $.extend( {}, defaults, data.options );

		templates.quiz = Handlebars.compile($(settings.quiz_template).html());
		templates.question = Handlebars.compile($(settings.question_template).html());
		templates.answer = Handlebars.compile($(settings.answer_template).html());
		templates.result = Handlebars.compile($(settings.result_template).html());

    	Handlebars.registerPartial("question", templates.question);
    	Handlebars.registerPartial("answer", templates.answer);
    	Handlebars.registerPartial("result", templates.result);

		if(data.questions) {
			quiz.questions = data.questions;
		}

		if(data.results) {
			quiz.results = data.results;
		}
	}

	out.prototype.quiz_data = quiz;

	out.prototype.setTitle = function(title) {
		quiz.title = title;
		queueRender();
	} 

	out.prototype.addQuestions = function(questions) {
		var _this = this;
		$.each(questions, function(i, v){
			_this.addQuestion(v);
		})
	}
	out.prototype.addQuestion = function(question) {
		if(question.answers) {
			shuffle(question.answers)
		}
		quiz.questions.push(question);
		queueRender();
	}

	out.prototype.addResults = function(results) {
		var _this = this;
		$.each(results, function(i, v){
			_this.addResult(v);
		})
	}
	out.prototype.addResult = function(result) {
		quiz.results.push(result);
		queueRender();
	}

	out.prototype.render = function() {
		queueRender.call(this);		
	}


	return out;


})(jQuery, Handlebars, window, document);
