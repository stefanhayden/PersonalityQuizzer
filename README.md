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


## Anatomy of a Question Object

Add as many questions as needed. Enter 1 answer option for each result you plan on having.

Each question must have an array of answer objects. Each answer object must have a result id that corisponds with the result object. The score is used to weight different answers in favor of diferent results.

all other attributes are not required but will be passed to the template.

```javascript
{ 
	color: "#7FD863",
	title: "Pick a Number",
	answers: [ /* answer object */ ]
};
```


## Anatomy of an Answer Object

```javascript
{ 
	text: "Like a baby",
	result: 1,
	score: 1 /* optional */
}
```


## Anatomy of a Result Object

each result object must have an id that will be used in reference by <a href="#anatomy-of-a-question-object">question object</a>.

All other attributes are not required but will be passed to the template.

```javascript
{
	id: 1,
	text: "You're a number 1"
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
