PersonalityQuizer - v0.02
=================

A simple API to quickly create a Personality quiz.

<a href="http://stefanhayden.github.io/PersonalityQuizer/">Try a simple demo here</a>

Requires: <a href="http://jquery.com/">jQuery</a>, <a href="https://github.com/blakeembrey/dombars">DOMBars</a>


include libraries

```html
	<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
	<script type="text/javascript" src="vendor/dombars.min.js"></script>
	<script type="text/javascript" src="PersonalityQuizer.js"></script>
```

Start new PersonalityQuizer object and fit it with quiz data:

```javascript
	var quiz = new PersonalityQuizer();
	quiz.set("title","What kind of Git Repo are you?")
	quiz.addQuestion({ 
		color: "#7FD863",
		title: "Tabs or Spaces?",
		answers: [
			{ 
				text: "Tabs",
				result: 1
			},
			{ 
				text: "Spaces",
				result: 2
			},
		]
	});
	quiz.addResults([
		{
			id: 1,
			text: "You are a Tabs repo!"
		},
		{
			id: 2,
			text: "You are a spaces repo!"
		},
	]);
```

## API for PersonalityQuizer() objects

Parameter | Values | Default | Notes
---------- | --------- | -------- | -------------
setTitle | text | - | sets a name. Mainly for reference in the templates
addQuestions | array | - | an array of question objects
addQuestion | object | - | a <a href="#anatomy-of-a-question-object">question object</a> with child <a href="#anatomy-of-an-answer-object">answer objects</a>
addResults | array | - | an array of <a href="#anatomy-of-a-result-object">result objects</a>
render | - | - | force quiz to render

## PersonalityQuizer Options
```javascript
var quiz = new PersonalityQuizer({
	append: "body",
	quiz_template: "#quiz_template",
	question_template: "#question_template",
	answer_template: "#answer_template",
	result_template: "#result_template",
	shuffle: true,
	debounce: 10,
});
```
Parameter | Values | Default | Notes
---------- | --------- | -------- | -------------
append | text | body | this is the css selector that the quiz will be appended to.
quiz_template | text | quiz_template | the id of the template
question_template | text | question_template | the id of the template
answer_template | text | answer_template | the id of the template
result_template | text | result_template | the id of the template
shuffle | boolean | true | shuffles the question order.
debounce | number | 10 | stop the template from rerendering to often.

## Anatomy of a Question Object

Add as many questions as needed. Each question must have an array of <a href="#anatomy-of-an-answer-object">answer object</a>. 

Other attributes will be passed in to the template.

```javascript
{
	answers: [ /* answer object */ ] /* required */
};
```


## Anatomy of an Answer Object

Each answer object must have a result id that corisponds with the <a href="#anatomy-of-a-result-object">result objects</a>. The score is used to weight different answers in favor of diferent results.

Other attributes will be passed in to the template.

```javascript
{
	result: 1, /* required */
	score: 1 /* optional */
}
```


## Anatomy of a Result Object

each result object must have an id that will be used in reference by <a href="#anatomy-of-an-answer-object">answer object</a>.

Other attributes will be passed in to the template.

```javascript
{
	id: 1, /* required */
}
```

Add these DOMBars templates to the HTML. Be sure to include the 3 outlet helpers for questions, answers and results.

```html

<script id="quiz_template" type="text/x-handlebars-template">
	<div class="quiz">
		<div class="questions">
			{{{outlet 'questions'}}}
		</div>
		<div class="results">
			{{{outlet 'results'}}}
		</div>
	</div>
</script>


<script id="question_template" type="text/x-handlebars-template">
	<div class="question" >
		<h1 style="background:{{color}}">{{{title}}}</h1>
		<div class="answers">
				{{{outlet 'answers'}}}
		</div>
	</div>
</script>

<script id="answer_template" type="text/x-handlebars-template">
	
	<div class="answer {{#if selected}}selected{{/if}}" data-result="{{result}}" >
		<div class="wrapper">
		<div class="table">
			<div class="text" style="background:{{parent.color}}">
				{{text}}
			</div>
		</div>
		</div>
		<div class="footer">
			<div class="checkbox"></div>
		</div>
	</div>
	
</script>

<script id="result_template" type="text/x-handlebars-template">
		<div class="result {{#if selected}}selected{{/if}}" >
			<div class="wrapper">
				<div class="title">{{title}}</div>
				<img src="" class="mainImage" height="100" width="100">
				<p>{{text}}</p>
			</div>
		</div>
</script>
```
