# Lexer and Regular Expressions

In this part of the tutorial, we are going to understand the Lexer definition of the *Grammar Editor* template in more detail. We are going to use it to scale up the expressive power of our live code languages in terms of the vocabulary they allow. 

## The Lexer definition

The *Lexer* or *Tokeniser* definition is the first code block delimited by ```@{%``` and ```%}```. This code does *lexical analysis* of textual content, which means that the *Lexer* is responsible for recognising all the smallest units (i.e. lexemes or tokens, such as nouns, verbs ) in the text of the  *LiveCode Editor* and chopping it all up.

However, we do need to define how these tokens should be recognised. We will do that by adding Regular Expressions (RegEx) in Javascript to define the patterns to recognise these tokens in a string. 

There are many [tutorials](https://www.w3schools.com/jsref/jsref_obj_regexp.asp) and even specialised interactive [tools](https://regex101.com/) available that can you help test your RegExs and we will be looking into them.
  
Our previous 1-token language had one specific token, the word *click*. Now we want to add up more patterns to make a more sophisticated language, a 3-token language.

Copy this code snippet and paste it on line 10 of the Grammar Editor.

```
    convol1:  /convol1/, 
    heart:    /heart/,
    click:    /click/,
	ws: { match: /\s+/, lineBreaks: true }
```

Given that the *Grammar Editor* does continuous evaluation, this code will be compiled on every change and incorporated into the grammar —using the macro `@lexer lexer`— before the parser is generated.


## The Grammar definition

We are also going to advance our knowledge of the grammar a little bit more, although a more detailed will be presented in the Grammar rules section.

<!-- In our previous 1-token language we wrote as first rule 

`main -> _ Statement _`

which means that the parser, generated from our grammar, will accept text that:

* starts with white space `_`

* followed by a statement 

* followed by more white space 

The second rule defined Statement as such:

`Statement -> %click`

This rule means that a statement in our language, has the token `click`.

This ruled uses a token defined in the Lexer with the RegEx `/click/` to match the string `click`.  -->

Let's expand our 1-token language to a 3-token language in the grammar, by adding a two more rules that bind the new tokens to the grammar.

`Statement -> %convol1`

`Statement -> %heart`

Note that all these grammar rules define the alternatives for what a Statement is in our new language, and what the parser will accept.

We still haven't looked into the code blocks that follow the definition of each rule. We will be doing that in the next section where we will focus on the the grammar rules. For now, let's pay attention to patterns in the code blocks and what changes. 

Copy these blocks and paste them sequentially to the grammar definition section in the Grammar Editor, just before `# Whitespace`

```
Statement -> %convol1
{% 
  // JS 'arrow' function definition 
  d => [{
    '@spawn': {
      '@sigp': {
        '@params': [{        
          '@sigp': { 
            '@params': [{
                '@num': { value: 1 }
              },
              {
                '@string': 'convol1'
              }
            ],
            '@func': { value: 'loop'  }
          }
        }],
        '@func' : {
          value: "dac"
        }
      }
    }
  }]
%}
```

```
Statement -> %heart
{% 
  // JS 'arrow' function definition 
  d => [{
    '@spawn': {
      '@sigp': {
        '@params': [{        
          '@sigp': { 
            '@params': [{
                '@num': { value: 1 }
              },
              {
                '@string': 'heart'
              }
            ],
            '@func': { value: 'loop'  }
          }
        }],
        '@func' : {
          value: "dac"
        }
      }
    }
  }]
%}
```

```
Statement -> %click
{% 
  // JS 'arrow' function definition 
  d => [{
    '@spawn': {
      '@sigp': {
        '@params': [{        
          '@sigp': { 
            '@params': [{
                '@num': { value: 1 }
              },
              {
                '@string': 'click'
              }
            ],
            '@func': { value: 'loop'  }
          }
        }],
        '@func' : {
          value: "dac"
        }
      }
    }
  }]
%}
```

So, now we have a grammar which generates a parser that recognises fixed strings of a 3-token language, which match sample names in our sample set.

If you examine the code blocks `{%` `%}` after each rule, what are the similaries between them? And what are the differences?

In the next section we are going to look at the aspects of grammar rules in more detail.


