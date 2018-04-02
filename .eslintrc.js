{
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "node": true
    },
    "settings": {
        "ecmascript": 6,
        "jsx": true,
		"es6": true,
    "browser": true
    },
    "plugins": [
        "react",
		"babel",
		"react-redux",
		"import"
    ],
    "rules": {
	    "max-len": [1, 120, 2, {ignoreComments: true}],
    "prop-types": [2],
        "strict": 0,
        "quotes": 0,
        "no-unused-vars": 0,
        "camelcase": 0,
        "no-underscore-dangle": 0,
		"babel/new-cap": 1,
    "babel/object-curly-spacing": 1,
    "babel/no-invalid-this": 1,
    "babel/semi": 1,
	        "react-redux/connect-prefer-named-arguments": 2,
			"import/named": 2
    },
	"ecmaFeatures": {
    "jsx": true,
    "experimentalObjectRestSpread": true
  },
	"extends": [
	        "plugin:react-redux/recommended",
			  "plugin:react/recommended",
			  "eslint:recommended",
			  "extends": "airbnb"
	]
}