import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Thumbor from 'react-thumbor';

export default class App extends Component {
  componentWillMount() {
    window.reactThumbor = {
      server: 'https://images.groupthreads.com'
    };
  }

	render() {
		return (
			<div>
				<Thumbor
          height="800px"
          width="50%"
          preset="responsive"
          src="https://upload.wikimedia.org/wikipedia/commons/b/bd/Tampa_FL_Sulphur_Springs_Tower_tall_pano02.jpg" />
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
