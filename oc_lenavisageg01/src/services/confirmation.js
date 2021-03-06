//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import Config from "../config/config.js";
import PropTypes from "prop-types";
import Tools from "../model/tools.js";
import CustomerInput from "./customer-input.js";
//@@viewOff:imports

const rowClassName = UU5.Common.Css.css`
  & > div {
    display: inline-block;

    &:first-child {
      width: calc(100% - 100px);
    }

    &:last-child {
      width: 100px;
      text-align: right;
    }
  }
`;

const level2ClassName = UU5.Common.Css.css`
  margin-left: 16px;
`;

const boldClassName = UU5.Common.Css.css`
  border-top: 1px solid black;
  font-weight: bold;
`;

const Row = ({ label, price, bold, level = 1 }) => {
  let classNames = [rowClassName];
  if (level === 2) classNames.push(level2ClassName);
  if (bold) classNames.push(boldClassName);

  return (
    <div className={classNames.join(" ")}>
      <div>{label}</div>
      <div>{price} Kč</div>
    </div>
  );
};

function getServices(order, sum) {
  let items = order.listServices().map(service => (
    <div key={service.key}>
      <Row label={service.name} price={service.price} />
      {service.quantity && (
        <Row level={2} label={`${service.quantity}x ${service.unit}ml`}
             price={service.quantity * service.unitPrice} />
      )}
    </div>
  ));

  const deposit = order.getDeposit();
  if (deposit) {
    items.push(
      <div key="deposit">
        <Row label="Zaplaceno" price={-1 * deposit} />
      </div>
    );
  }

  items.push(
    <div key="result">
      <Row label="CELKEM" price={sum - deposit} bold />
    </div>
  );

  return (
    <div>
      {items}
    </div>
  )
}

export const Confirmation = createReactClass({
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Confirmation",
    classNames: {
      main: Config.CSS + "confirmation"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onConfirm: PropTypes.func,
    onRefuse: PropTypes.func,
    order: PropTypes.object
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _confirm(order) {
    if (this._customer.isValid()) {
      let customer = this._customer.getValue();
      let desc = this._desc.getValue();

      let result = { ...order };

      if (customer) result.customer = customer;
      if (desc) result.desc = desc;

      this.props.onConfirm(result);
    }
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let summary = this.props.order.getSummary();

    return (
      <UU5.Bricks.Section
        {...this.getMainPropsToPass()}
        className="uu5-common-padding-xs"
        level={4}
        header={[Tools.getBackButton(this.props.onRefuse), this.props.order.getTitle()]}
      >
        <CustomerInput
          ref_={customer => this._customer = customer}
          className={UU5.Common.Css.css`margin-bottom: 24px`}
        />
        {getServices(this.props.order, summary.sum)}
        <UU5.Forms.TextArea placeholder="Poznámka" ref_={area => this._desc = area} />
        <UU5.Bricks.Button
          className={UU5.Common.Css.css`margin-top: 8px`}
          onClick={() => this._confirm(summary)}
          content="Potvrdit"
          size="xl"
          displayBlock
          colorSchema="primary"
        />
      </UU5.Bricks.Section>
    );
  }
  //@@viewOff:render
});

Confirmation.getServices = getServices;

export default Confirmation;
