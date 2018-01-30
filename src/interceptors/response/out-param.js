/**
 * @module ResponseInterceptor:OutParam
 */

const RETURN_KEY = 'qReturn';

/**
* Picks out the result "out" parameter based on the QIX method+schema, with
* some specific handling for some methods that breaks the predictable protocol.
* @param {object} session - The session the intercept is being executed on.
* @param {object} request - The JSON-RPC request.
* @param {object} response - The response.
* @returns {object} - Returns the result property on the response
*/
export default function outParamInterceptor(session, request, response) {
  if (request.method === 'CreateSessionApp' || request.method === 'CreateSessionAppFromApp') {
    // this method returns multiple out params that we need
    // to normalize before processing the response further:
    response[RETURN_KEY].qGenericId = response[RETURN_KEY].qGenericId || response.qSessionAppId;
  } else if (request.method === 'GetInteract') {
    // this method returns a qReturn value when it should only return
    // meta.outKey:
    delete response[RETURN_KEY];
  }

  if (hasOwnProperty.call(response, RETURN_KEY)) {
    return response[RETURN_KEY];
  } else if (request.outKey !== -1) {
    return response[request.outKey];
  }

  return response;
}
