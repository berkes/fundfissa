import React from 'react';
class TransactionReport extends React.Component { 
  static defaultProps = {
    txHash: null,
    txStatus: ""
  }

  render() {
    const { txHash, txStatus } = this.props;
    if (txHash === null) {
      return "";
    }

    let alertBox = ""
    switch (txStatus) {
      case 'pending':
        alertBox = <div className="alert alert-warning" role="alert">
                     <h4 className="alert-heading">Thanks. But wait!</h4>
                      <p>
                        The transaction is pending. Once the transaction is mined, we know
                        if it was successfull (or failed), so hang on for a few more seconds.
                      </p>
                    </div>
        break;
      case 'confirmed':
        alertBox = <div className="alert alert-success" role="alert">
                      <h4 className="alert-heading">Success!</h4>
                      <p>
                        The transaction was <strong>successfull</strong><br/>
                        Thanks for your help with funding this event!
                      </p>
                    </div>
        break;
      case 'failed':
        alertBox = <div className="alert alert-danger" role="alert">
                      <h4 className="alert-heading">Woops!</h4>
                      <p>
                        The transaction has <strong>failed</strong>, you do not have a ticket,
                        and your payment was reverted.
                      </p>
                   </div>
          break;
      default:
    }

    return(<div>{ alertBox }</div>);
  }
}

export default TransactionReport;
