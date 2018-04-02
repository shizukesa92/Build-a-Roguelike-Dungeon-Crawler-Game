import React from "react";
import ReactDOM from "react-dom";

// Renders squares and generates fog if enabled
export default class Square extends React.Component {
	render() {
		let opaque = this.props.square.opacity;

		this.props.distance > 10 && this.props.fog ? opaque = 0 : opaque = 1;

		return (
			<div className={
                "square " + this.props.square.type 
                   } style = {{opacity: opaque}}
	></div>

		)
	}
}