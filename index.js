exports.handler = function (event, context) {
    
    var request = event.request;

    try{

        if (request.type === "LaunchRequest") {
            handleLaunchRequest(context);
        } else if (request.type === "IntentRequest") {
            if (request.intent.name === "HelloIntent") {
                handleHelloIntent(request, context);
            } else if (request.intent.name === "AMAZON.StopIntent"){
                handleEndSessionRequest(context);
            } else {
                context.fail("Unknown Intent");
            }
        } else if (request.type === "SessionEndedRequest") {
            handleEndSessionRequest(context);
        } else {
            context.fail("Unknown Request");
        }

    } catch (e) {
        context.fail("Exception: " + e);
    }
}

function handleLaunchRequest(context) {
    var options = {};

    options.speechText = "Welcome to our greeter skill. I can fist bump your lit and savage friends";
    options.repromptText = "You can say \"fist bump, Sebastian!\", Whom shall I fist bump?";
    options.endSession = false;

    context.succeed(buildResponse(options));
}

function handleHelloIntent(request, context) {
    var options = {};
    var name = request.intent.slots.FirstName.value;

    options.speechText = `What up, ${name}! You are looking so aesthetic today!`;
    options.endSession = true;

    context.succeed(buildResponse(options));
}

//function to end skill
function handleEndSessionRequest(context) {
    context.succeed(buildResponse({
        speechText: "Thank you for using greeter. You are the GOAT!",
        endSession: true
    }));
}

//function to build Alexa's response dynamically
function buildResponse(options) {
    var response = {
        version: "1.0",
        response: {
            outputSpeech: {
                type: "PlainText",
                text: options.speechText
            },
            shouldEndSession: options.endSession
        }
    };

    if (options.repromptText) {
        response.response.reprompt = {
            outputSpeech: {
                type: "PlainText",
                text: options.repromptText
            }
        };
    }

    return response;
}