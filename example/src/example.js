import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Thumbor from 'react-thumbor';

export default class App extends Component {
	render() {
		return (
			<div>
				<Thumbor
          debug={true}
          server="https://images.groupthreads.com"
          src="https://upload.wikimedia.org/wikipedia/commons/b/bd/Tampa_FL_Sulphur_Springs_Tower_tall_pano02.jpg">
      <h1>This is Hard</h1>
      </Thumbor>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
