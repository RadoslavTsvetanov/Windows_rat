import { ResponseStatuses, UDP } from "./baseServer";







enum SessionStatus {
    open = "opened",
    closed = "closed"
}

let session = SessionStatus.closed

function startSession() {
   session = SessionStatus.open 
}
function endSession() {
    session  = SessionStatus.closed
}


function getSessionStatus(): SessionStatus {
    return session
}



// switch (parseInt(msg.toString())) {
//         case messages.start_session:
//             startSession();
//             sendResponse(server, rinfo, {
//                 status: responses_statuses.succesfull, payload: 
//                 ""
//             })
//           break;
//         case messages.end_session:
//             endSession()
//             sendResponse(server, rinfo, ({status: responses_statuses.succesfull, payload: ""}))
//           break;
//         case messages.get_session_statues:
//             sendResponse(server, rinfo, {status: responses_statuses.succesfull, payload: getSessionStatus() })
//             break;
//         default:
//            sendResponse(server, rinfo, {status: responses_statuses.couldnt_find_handler_for_this_req, payload: ""})
//           break;

new UDP()
  .addHandler<{}>(messages.end_session.toString(), async (payload: {}) => {
      endSession();
  return {status: ResponseStatuses.Successful, payload: {}}
  })
  .addHandler<{}>(messages.start_session.toString(), async (payload: {}) => {
      startSession();
      return {status: ResponseStatuses.Successful, payload: {}}
  })
  .addHandler<{}>(messages.get_session_statues.toString(), async (payload: {}) => {
      return {status: ResponseStatuses.Successful, payload: getSessionStatus()}
  })
  .listen(41234);