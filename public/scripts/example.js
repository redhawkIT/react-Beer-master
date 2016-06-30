// - BeerApp
// - bool ? BrewerysList : BrewerySeach


// if showBeer clicked 
//    displayBeer
// else 
//    display FindBeer

class BeerApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      brewerys: [],
      showBeerResults: false
    };
  }

  componentWillMount() {
    this._fetchBrewerys();
  }

  _onClickfindBeersGPS() {
    this.setState({ showBeerResults: true})
  }


  render() {
    const brewerysComponents = this._createBreweryComponents();
    //  { this.state.showResults ? <Results /> : null }
    return (
      <div className="container">
          <div className="row">
              <div className="col-sm-offset-2 col-sm-8 col-md-offset-3 col-md-6">
                  <h1 className="text-center">Local Brewerys</h1>
                  <div className="breweryList list-group text-center well">
                    {brewerysComponents}
                  </div>
              </div>
          </div>
      </div>
    )
  }

  _fetchBrewerys() {
    $.ajax({
      url: '/api/comments',
      dataType: 'json',
      cache: false,
      success: (Data) => {
        this.setState({
          brewerys: Data.data
        });
      },
      error: err => console.log(err.toString())
    });
  }

  _createBreweryComponents() {
    //var brewerysNameList = this.state.brewerys.filter(beer => beer.brewery.images)//.map(beer => [beer.brewery.name, beer.streetAddress, beer.postalCode]);
    //var beer = this.state.brewerys[3];

    //console.log(beer.brewery);

    return this.state.brewerys.filter(beer => beer.streetAddress && beer.openToPublic == "Y" && beer.locationType != "office").map(beer => {
      return <Brewery
        key={Math.random()}
        name={beer.brewery.name}
        address={beer.streetAddress}
        zipcode={beer.postalCode}
        distance={beer.distance}
      />
    });
  }
}

class Brewery extends React.Component {
  render() {
    return (
        <a  className="list-group-item">
           <h4 className="list-group-item-heading">{this.props.name}</h4>
           <p className="list-group-item-text">{this.props.address + ', ' + this.props.zipcode }</p>
           <p className="list-group-item-text">{`${this.props.distance} miles away`}</p>
        </a>
      )
  }
}

class BreweryList extends React.Component {
  render() {
    return (

      )
  }
}

class BrewerySearch extends React.Component {
  render() {
    return (

      )
  }
}


ReactDOM.render( < BeerApp / > , document.getElementById('app'));
