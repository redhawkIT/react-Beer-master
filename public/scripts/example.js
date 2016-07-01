class BeerApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showBeerResults: false
    };
  }

  render() {
    //  { this.state.showResults ? <Results /> : null }
    return (
      <div className="container">
          <div className="row">
              <div className="col-sm-offset-2 col-sm-8 col-md-offset-3 col-md-6">
                  <BreweryListView/>
              </div>
          </div>
      </div>
    )
  }
}

class BreweryListView extends React.Component {

constructor(props) {
    super(props);
    this.state = {
      brewerys: [],
      longitude: null,
      latitude: null
    };
  }

  componentWillMount() {
    // Invoked once, both on the client and server, immediately before the initial rendering occurs.
    this._getLocation();
  }

  render() {
    const brewerysComponents = this._createBreweryComponents();

    return (
        <div>
          <h1 className="text-center">Local Brewerys</h1>
            {brewerysComponents}
        </div>
      )
  }

  _getLocation() {
    //this.setState({ showBeerResults: true});

    if('geolocation' in navigator) {
      this._requestLocation();
    } else {
      console.log("Browser doesn't support geolocation");
    }
  }

  _requestLocation() {

    //const options = {enableHighAccuracy: false, timeout: 5000, maximumAge: 0};
    console.log("_requestLocation")
    //navigator.geolocation.getCurrentPosition(this._success.bind(this));

    navigator.geolocation.getCurrentPosition(this._success.bind(this), error, options);
    const error = err => console.log(err);
  }

  _success(pos) {
    const long = pos.coords.longitude;
    const lat = pos.coords.latitude;

    console.log("long", long, "Lat", lat);

    this.setState({latitude: lat, longitude: long})

    this._fetchBrewerysByLocation();

  }

  _fetchBrewerysByLocation() {
    $.ajax({
      //url: '/api/comments',
      url: `http://api.brewerydb.com/v2/search/geo/point?radius=25&lat=${this.state.latitude}&lng=${this.state.longitude}&key=a3112121a853b5030fb64addbc45e14a`,
      dataType: 'json',
      cache: false,
      success: (Data) => {
        console.log("DATA", Data)
        this.setState({
          brewerys: Data.data
        });
      },
      error: err => console.log(err)
    });
  }

  _createBreweryComponents() {
    //var icons = this.state.brewerys.filter(beer => beer.brewery.images);
    //console.log(icons.map(beer => beer.brewery.images.icon).length)
    console.log(this.state.brewerys)
    return this.state.brewerys.filter(beer => beer.streetAddress && beer.openToPublic == "Y" && beer.locationType != "office" && beer.brewery.images).map(beer => {
      return <BreweryItem
        key={Math.random()}
        name={beer.brewery.name}
        address={beer.streetAddress}
        zipcode={beer.postalCode}
        distance={beer.distance}
        type={beer.locationType}
        icon={beer.brewery.images.icon}
      />
    });
  }
}

class BreweryItem extends React.Component {
  render() {
    return (
      <div>
          <div className="list-group breweryList">
              <a className="list-group-item" href="#">
                {this.props.name}
                <span className="distance pull-right">{`${this.props.distance} miles`}</span>
              </a>
          </div>
      </div>
      )
  }
}

ReactDOM.render( < BeerApp / > , document.getElementById('app'));
