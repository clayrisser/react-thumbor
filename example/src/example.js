import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Thumbor from 'react-thumbor';

export default class App extends Component {
	render() {
		return (
			<div>
				<Thumbor
          preset="responsive"
          debug={true}
          server="https://images.groupthreads.com"
          src="http://www.wallpaperup.com/uploads/wallpapers/2014/01/23/235641/big_thumb_862478b1ad52546192af60ff03efbde9.jpg">
      <h1>This is Hard</h1>
      </Thumbor>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
