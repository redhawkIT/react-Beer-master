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

    var options = {enableHighAccuracy: false, timeout: 5000, maximumAge: 0};

    navigator.geolocation.getCurrentPosition(this._success.bind(this), error, options);


    var error = err => console.log(err);
  }

  _success(pos) {
    var long = pos.coords.longitude;
    var lat = pos.coords.latitude;

    console.log("long", long, "Lat", lat);
    this.setState({latitude: lat, longitude: long})
    //debugger

    // send location data server
    this._fetchBrewerysByLocation(); // change to promise

  }

  _fetchBrewerysByLocation() {
    $.ajax({
      //url: '/api/comments',
      url: `http://api.brewerydb.com/v2/search/geo/point?radius=25&lat=${this.state.latitude}&lng=${this.state.longitude}&key=a3112121a853b5030fb64addbc45e14a&callback=JSON_CALLBACK`,
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

    // if(b.brewery.images) { brewery.icon = b.brewery.images.icon; }
    console.log("_createBreweryComponents");
    //var icons = this.state.brewerys.filter(beer => beer.brewery.images);
    //console.log(icons.map(beer => beer.brewery.images.icon).length)
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


class BrewerySearchView extends BeerApp {
  render() {
    return (
      <div>Near Me</div>
      )
  }
}




ReactDOM.render( < BeerApp / > , document.getElementById('app'));
