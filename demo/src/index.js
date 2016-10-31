import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import QuillComponent from '../../src'

class Editor extends Component {

  constructor(props){
    super(props)
    this.state = {
      theme: 'snow',
      enabled: true,
      readOnly: false,
      value: '',
      events: []
    }
  }


  formatRange = (range) => {
    return range
      ? [range.start, range.end].join(',')
      : 'none';
  }

  onTextareaChange = (event) => {
    var value = event.target.value;
    this.setState({ value:value });
  }

  onEditorChange = (value, delta, source) => {
    this.setState({
      value,
      events: [
        `text-change(${this.state.value} -> ${value})`
      ].concat(this.state.events)
    });
  }

  onEditorChangeSelection = (range, source) => {
    this.setState({
      selection: range,
      events: [
        `selection-change(
          ${this.formatRange(this.state.selection)}
         ->
          ${this.formatRange(range)}
        )`
      ].concat(this.state.events)
    });
  }

  onToggle = () => {
    this.setState({ enabled: !this.state.enabled });
  }

  onToggleReadOnly = () => {
    this.setState({ readOnly: !this.state.readOnly });
  }

  renderToolbar = () => {
    const { enabled, readOnly } = this.state;
    const selection = this.formatRange(this.state.selection);

    return (
      <div>
        <button
          onClick={ this.onToggle }
        >
          { enabled ? 'Disable' : 'Enable' }
        </button>
        <button
          onClick={ this.onToggleReadOnly }
        >
          Set { readOnly ? 'read/Write' : 'read-only' }
        </button>
        <button
          disabled={ true }
        >
          Selection ({ selection })
        </button>
      </div>
    )
  }

  renderSidebar = () => {
    return (
      <div style={{ overflow:'hidden', float:'right' }}>

        <textarea style={ { display:'block', width:300, height:300 } }
          value={ this.state.value }
          onChange={this.onTextareaChange}
        />

        <textarea style={ { display:'block', width:300, height:300 } }
          value={ this.state.events.join('\n') }
        />

      </div>
    )
  }

  render = () => {

    const props = {
      theme: this.state.theme,
      value: this.state.value,
      readOnly: this.state.readOnly,
      onChange: this.onEditorChange,
      onChangeSelection: this.onEditorChangeSelection
    }

    return (
      <div>
        <QuillComponent { ...props } />
        { this.renderSidebar() }
      </div>
    )
  }
}


window.addEventListener('DOMContentLoaded', function() {
  console.log('func run')
  ReactDOM.render(
    <Editor />,
    document.getElementById('app')
  )
})
