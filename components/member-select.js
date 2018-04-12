const React = require('react');

class MemberSelect extends React.Component {
  render() {
    const { idyll, hasError, updateProps, data, selected, ...props } = this.props;
    return (
      <div className="member-select">
        {
          data.map(d => {
            return <div key={d.name} onClick={() => updateProps({ selected: d.name })}
            className={`member ${d.name === selected ? ' selected' : ''}`}>{d.name} <i>({d.value})</i></div>
          })
        }
      </div>
    );
  }
}

module.exports = MemberSelect;
