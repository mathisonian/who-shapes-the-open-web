const React = require('react');
const d3 = require('d3-scale');
// import { Spring, animated, template } from 'react-spring'
var Masonry = require('react-masonry-component');

var masonryOptions = {
  transitionDuration: 50,
  gutter: 0,
  horizontalOrder: true,
  fitWidth: true,
  initLayout: true,
  originLeft: false,
  originTop: true
};


class MemberSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    }
  }

  updateScales(props) {
    const { normalize } = props;
    this.cellPadding = 0;
    this.cellWidth = 250;
    this.cellHeight = this.cellWidth;
    // this.columns = Math.floor(window.innerWidth / this.cellWidth)
    const upperBound = normalize ? 0.5 : 20;
    this.widthScale = d3.scaleSqrt().domain([0, upperBound]).range([60, this.cellWidth - 2 * this.cellPadding]);
    this.heightScale = d3.scaleSqrt().domain([0, upperBound]).range([60, this.cellHeight - 2 * this.cellPadding]);
    this.fontScale = d3.scaleSqrt().domain([0, upperBound]).range([8, 24]);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.normalize !== this.props.normalize) {
      this.updateScales(newProps);
    }
  }

  componentDidMount() {
    this.updateScales(this.props);
    this.setState({ mounted: true });
  }
  render() {
    const { idyll, hasError, updateProps, normalize, data, selected, ...props } = this.props;
    data.sort((a, b) => {

      const valA = (a.memberIndex[selected] || 0) / (normalize ? a.total : 1);
      const valB = (b.memberIndex[selected] || 0) / (normalize ? b.total : 1);
      return valB - valA;
    })
    if (!this.state.mounted) {
      return null;
    }
    return (
      <Masonry className={'group-vis'}>
          {
          data.map((d, idx) => {
            // const i = idx % this.columns;
            // const j = Math.floor(idx / this.columns);
            if (!d.memberIndex[selected]) return null;
            const val = d.memberIndex[selected] / (normalize ? d.total : 1);
            const width = this.widthScale(val);
            const height = this.heightScale(val);
            const fontSize = this.fontScale(val);
            return (
              <div key={d.name} className={'group-item'} style={{width: width, minHeight: height, margin: 10}}>
                <div style={{margin: 10}}>
                  <span style={{fontSize: fontSize}}>
                      {d.name}
                  </span>
                  <br/>
                  <br/>
                  <span style={{fontSize: fontSize - 4}}>
                      {d.memberIndex[selected]} / {d.total} members
                  </span>
                  <br/>
                  <span style={{fontSize: fontSize - 6, fontStyle: 'italic'}}>
                      <a href="#">Group Link</a>
                  </span>
                </div>
            </div>
            )
          })
        }
      </Masonry>
    );
  }
}

module.exports = MemberSelect;
