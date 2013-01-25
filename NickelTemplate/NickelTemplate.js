/*  
    NickelTemplate
     ~ Nickel template system for Pokki
       Part of Nickel.js

    @authors
        John Chavarria <m@psi.sh>
    @version 1.0
    @license LGPL v3.0 (http://www.gnu.org/licenses/lgpl.html)

    @copyright (c) 2010-2013, Authors.

*/

(function() {

	// Object to cache templates.
	Nickel.Templates = new Object();

	Nickel.Template = function Template(template, args, container)
	{

		this.template  = template;
		this.args 	   = args;
		this.container = container;

		if (!Nickel.configuration.assets.template) {
			Nickel.error('NickelTemplate', 'configuration', true);

			return false;
		} else {

			if (!Nickel.configuration.assets.template.directory) {
				Nickel.error('NickelTemplate',
				 'Missing directory path in configuration file.');
			}
			if (!Nickel.configuration.assets.template.extension) {
				Nickel.error('NickelTemplate',
				 'Missing extension format in configuration file.');
			}

			if (Nickel.configuration.assets.template.directory &&
			 Nickel.configuration.assets.template.extension) {
				this.get();
				var parse = this.parse();
				if (typeof parse == 'string') {
					this.container.innerHTML = parse;
				} else {
					Nickel.error('NickelTemplate', 'Error parsing template.');
				}

				
				return this;
			}

			return false;
		}

	};

	Nickel.Template.prototype.get = function get() {

	    if (Nickel.Templates[this.template]) {
	        this.tpl = Nickel.Templates[this.template];   
	    } else {
	        var tpl = new XMLHttpRequest();
	        tpl.open("GET",
	        		 Nickel.configuration.assets.template.directory +
	        		  '/' + this.template + '.' +
	        		  Nickel.configuration.assets.template.extension,
	        		 false);
	        tpl.send();
	        Nickel.Templates[this.template] = tpl.responseText;
	        this.tpl = tpl.responseText;
	    }

	};

	Nickel.Template.prototype.parse = function parse()
	{

		this.tpl = this.ifs(this.tpl, 'if');

		return this.tpl;

	};

	Nickel.Template.prototype.ifs = function ifs(string, type)
	{

		var r = /{% if([\s\S]+?){% endif %}/g;
		return string = string.replace(r, function(markup, content) {

			var result = '';

			var stmnt     = content.indexOf('%}');
			var cond      = content.substring(0, stmnt).replace(/\s/g, '');
			content       = content.substring(stmnt + 2, content.length);
			var ifcontent = content.substring(0, content.indexOf('{%'));

			cond = cond.replace(/\(([\s\S]+?)\)/g, function(m, c) {

				return this.condition(c);

			}.bind(this));
			var eval = this.condition(cond);
			console.log(cond + ' : ', eval);
			if (!eval) {
				content = content.substring(ifcontent.length, content.length);
				console.log('the rest:', content);
			} else {
				result = ifcontent;
			}

			return result;

		}.bind(this));

	};

	Nickel.Template.prototype.condition = function condition(c)
	{

		var or  = c.indexOf('||') != -1;
		var and = c.indexOf('&&') != -1; 

		if (or || and) {
			var operator    = (or ? '||' : '&&');
			var expressions = c.split(operator);
			var left        = this.evaluate(expressions[0]);
			var right       = this.evaluate(expressions[1]);
			var evaluation = this.compare(left, right, operator);
		} else {
			var evaluation = this.evaluate(c);
		}

		return evaluation;

	}

	Nickel.Template.prototype.evaluate = function evaluate(exp)
	{
 
		var operators = ['==', '>=', '=<', '>', '<', '!='];
		var compare   = false;

		for (var i = 0; i < operators.length; i++) {
			var o = operators[i];
			if (exp.indexOf(o) != -1) {
				var expression = exp.split(o);
				var variable   = expression[0]; 
				var value      = this.decompose(variable);
				compare        = expression[1];
				return this.compare(value, compare, o);
			}
		}

		if (!compare) {
			var not = false;
			if (exp.charAt(0) == '!') {
				not = true;
				exp = exp.substring(1, exp.length);
			}

			var value = this.decompose(exp);			
			return (not ? (!value ? true : false) : (value ? true : false));
		}

	};

	Nickel.Template.prototype.compare = function compare(value, compare, op)
	{

		if (value == 'true') {
			value = true;
		} else if (value == 'false') {
			value = false;
		}

		if (compare == 'true') {
			compare = true;
		} else if (compare == 'false') {
			compare = false;
		}

		if (op == '==') {
			return (value == compare);
		} else if (op == '!=') {
			return (value != compare);
		} else if (op == '>=') {
			return (value >= compare);
		} else if (op == '<=') {
			return (value <= compare);
		} else if (op == '>') {
			return (value > compare);
		} else if (op == '<') {
			return (value < compare);
		} else if (op == '&&') {
			return (value && compare);
		} else if (op == '||') {
			return (value || compare);
		}

	};

	Nickel.Template.prototype.decompose = function decompose(exp)
	{

        exp   = exp.split('.');
        count = exp.length;
        if (count > 1) {
            var initial = this.args[exp[0]];
            var explode = exp.splice(1, count);
            for (var i = 0; i < explode.length; i++) {
                initial = initial[explode[i]];
            }
            return initial;
        } else {
            return this.args[exp];
        }


	};

})();