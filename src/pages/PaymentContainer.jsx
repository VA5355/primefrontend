import React, { useRef, useEffect } from 'react';
import DropIn from 'braintree-web-drop-in-react';
const PaymentContainer = ({parentInstance , parentClientToken,
parentSetInstance,
}) => {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef}>
       <DropIn
                                options={{
                                  authorization: parentClientToken,
                                  paypal: {
                                    flow: 'vault',
                                  },
                                }}
                                onInstance={(parentInstance) => parentSetInstance(parentInstance)}
                              />
    </div>
  );
};
export default PaymentContainer;