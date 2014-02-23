PersonalityQuizer
=================

A simple API to quickly create a Personality quiz.

Requires: jQuery, Handlebarsjs


	var quiz = new Quiz();
	quiz.setTitle("What Number are you?")
	quiz.addQuestion({ 
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
	});

	quiz.addResults([
		{
			id: 1,
			text: "You're a number 1"
		},
		{
			id: 2,
			text: "You're a Number 2"
		},
	]);


Add these temnplates to the HTML

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