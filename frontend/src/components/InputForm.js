import React, {Component} from 'react';
import {Button, ButtonToolbar, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import '../index.css';

class InputForm extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleShortenClick = this.handleShortenClick.bind(this);
        this.handleTextboxSelect = this.handleTextboxSelect.bind(this);

        this.state = {
            isLoading: false,
            validation: null,
            validationText: ""
        };
    }

    handleShortenClick(e) {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        const url = data.get("url");
        const that = this;

        if (url == null || url === "") {
            this.setState({
                isLoading: false,
                validation: "error",
                validationText: "address cannot be empty"
            });
            return;
        }

        this.setState({
            isLoading: true,
            validation: null,
            validationText: ""
        });

        fetch('/s/shorten', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(data)
        })
        .then(function(resp) {
            let json = null;

            resp.json().then(function (data) {
                json = data;
            })
            .catch(function(exc) {
                that.setState({
                    isLoading: false,
                    validation: "error",
                    validationText: "server has returned invalid response"
                });

                console.log(exc);
            });

            if (resp.status !== 200) {
                that.setState({
                    isLoading: false,
                    validation: "error",
                    validationText: json["error"]
                });
            } else {
                that.setState({
                    isLoading: false,
                    validation: "success",
                    validationText: ""
                });
            }
        })
        .catch(function(exc) {
            that.setState({
                isLoading: false,
                validation: "error",
                validationText: ""
            });

            console.log(exc);
        })
    }

    handleTextboxSelect() {
        this.setState({
            isLoading: this.state.isLoading,
            validation: null,
            validationText: ""
        });
    }

    render() {
        const {isLoading} = this.state;

        return (
            <div>
                <form onSubmit={!isLoading ? this.handleShortenClick : null}>
                    <ControlLabel>Make your URL shorter and easier to remember</ControlLabel>
                    <FormGroup validationState={this.state.validation}>
                        <FormControl
                            name="url"
                            type="text"
                            placeholder="Enter URL"
                            bsSize="large"
                            onFocus={this.handleTextboxSelect}
                        />
                        <HelpBlock>{this.state.validationText}</HelpBlock>
                    </FormGroup>

                    <ButtonToolbar>
                        <Button
                            disabled={isLoading}
                            bsSize="large"
                            bsStyle="primary"
                            type="submit">
                            {isLoading ? "Loading..." : "Shorten" }
                        </Button>
                    </ButtonToolbar>
                </form>
            </div>
        );
    }
}

export default InputForm;