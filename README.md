PersonalityQuizer - v0.01
=================

A simple API to quickly create a Personality quiz.

Requires: <a href="http://jquery.com/">jQuery</a>, <a href="handlebarsjs.com">Handlebarsjs</a>


include libraries

```html
	<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
	<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.min.js"></script>
	<script type="text/javascript" src="https://raw.github.com/stefanhayden/PersonalityQuizer/master/PersonalityQuizer.js"></script>
```

Start new PersonalityQuizer object 

```javascript
	var quiz = new PersonalityQuizer();
```

## API for PersonalityQuizer() objects

Parameter | Values | Default | Notes
---------- | --------- | -------- | -------------
setTitle | text | - | sets a name. Mainly for reference in the templates
addQuestions | array | - | an array of question objects
addQuestion | object | - | a <a href="#anatomy-of-a-question-object">question object</a>
addResults | array | - | an array of <a href="#anatomy-of-a-result-object">result objects</a>
addResult | object | - | a result object
render | - | - | force quiz to render


## Anatomy of a Question Object

Add as many questions as needed. Enter 1 answer option for each result you plan on having.

Each question must have an array of answer objects. Each answer object must have a result id that corisponds with the result object. The score is used to weight different answers in favor of diferent results.

all other attributes are not required but will be passed to the template.

```javascript
	{ 
		color: "#7FD863",
		title: "Pick a Number",
		answers: [
			{ 
				text: "Like a baby",
				result: 1,
				score: 1 
			},
			{ 
				text: "Hugging my body pillow",
				result: 2,
				score: 1 
			},
		]
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

Add these Handlebar templates to the HTML

```Handlebars
	<script id="quiz_template" type="text/x-handlebars-template">
	<div class="quiz">
		<div class="questions">
			{{#each questions}}
				{{>question}}
			{{/each}}
		</div>
		<div class="results">
			{{> result}}
		</div>
	</div>
	</script>

	<script id="question_template" type="text/x-handlebars-template">
		<div class="question">
			<h1 style="background:{{color}}">{{{title}}}</h1>
			<div class="answers">
					{{> answer }}
			</div>
		</div>
	</script>

	<script id="answer_template" type="text/x-handlebars-template">
		{{#each answers}}
		<div class="answer" data-result="{{result}}" data-score="{{score}}">
			<div class="wrapper">
			<div class="table">
				<div class="text" style="background:{{../color}}">
					{{text}}
				</div>
			</div>
			</div>
			<div class="footer">
				<div class="checkbox"></div>
			</div>
		</div>
		{{/each}}
	</script>

	<script id="result_template" type="text/x-handlebars-template">
		{{#each results}}
			<div class="result" data-final-result="{{id}}">
				<div class="wrapper">
					<div class="title">{{../title}}</div>
					<img src="" class="mainImage" height="100" width="100">
					<p>{{text}}</p>
				</div>
			</div>
		{{/each}}
	</script>
```
