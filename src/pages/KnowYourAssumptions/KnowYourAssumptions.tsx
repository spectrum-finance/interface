import React, { useCallback, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useAppLoadingState } from '../../context';

// export const KnowYourAssumptions: React.FC = () => {
//   const [accepted, setAccepted] = useState(false);
//   const [, setAppLoadingState] = useAppLoadingState();
//   const { state: locationState } = useLocation();
//   const history = useHistory();
//
//   const handleConfirm = useCallback(() => {
//     setAppLoadingState({ isKYAAccepted: true });
//     const { from }: any = locationState ?? {
//       from: { pathname: '/' },
//     };
//     history.replace(from);
//   }, [setAppLoadingState, locationState, history]);
//
//   return (
//     <Page>
//       <Display width="800px">
//         <Text h1>Know Your Assumptions</Text>
//         <Text p>
//           ErgoDEX is a decentralized financial (DeFi) application which means it
//           doesn’t have a central government body. ErgoDEX Beta UI includes only
//           AMM (Swap, Deposit and Redeem) functionality.
//         </Text>
//         <Text b>By accepting these KYA, you agree that:</Text>
//         <ul>
//           <li>
//             <Text>You will use the product at your own peril and risk</Text>
//           </li>
//           <li>
//             <Text>Only YOU are responsible for your assets</Text>
//           </li>
//           <li>
//             <Text>
//               <a
//                 href="https://github.com/ergolabs/ergo-dex"
//                 target="_blank"
//                 rel="noreferrer"
//               >
//                 ErgoDEX Smart Contracts
//               </a>{' '}
//               meet your expectations
//             </Text>
//           </li>
//         </ul>
//         <Text b>Notice that:</Text>
//         <ul>
//           <li>
//             <Text>
//               ErgoDEX Beta UI operates on a live blockchain, thus trades are
//               final, and irreversible once they have status
//               &laquo;executed&raquo;.
//             </Text>
//           </li>
//           <li>
//             <Text>
//               Every transaction can be viewed via{' '}
//               <a
//                 href="https://explorer.ergoplatform.com/en/"
//                 target="_blank"
//                 rel="noreferrer"
//               >
//                 explorer
//               </a>
//             </Text>
//           </li>
//           <li>
//             <Text>
//               By creating an order you send your funds to a specific
//               smart-contract, all such contracts are wired into the UI. Thus,
//               orders are created entirely in your browser (on your machine).
//             </Text>
//           </li>
//         </ul>
//         <Text p b>
//           ErgoDEX Team doesn’t guarantee the absence of bugs and errors. ErgoDEX
//           is in Beta testing and has yet to be independently audited.
//         </Text>
//         <Text p b>
//           ErgoDEX offers a form of added security, as buyers and sellers do not
//           have to give their information to any 3rd party. However, ErgoDEX is
//           without a know your customer (KYC) process and can offer NO assistance
//           if a user is hacked or cheated out of passwords, currency or private
//           wallet keys.
//         </Text>
//         <Text p b>
//           We recommend that you DO NOT use ErgoDEX Beta UI to operate large
//           amounts of assets!{' '}
//         </Text>
//         <Text p>
//           <Checkbox checked={accepted} onChange={() => setAccepted(!accepted)}>
//             I understand the risks and accept the KYA regarding ErgoDEX Beta UI
//           </Checkbox>
//         </Text>
//         <Row>
//           <Button
//             shadow
//             type="success"
//             disabled={!accepted}
//             onClick={handleConfirm}
//           >
//             Confirm
//           </Button>
//         </Row>
//       </Display>
//     </Page>
//   );
// };
