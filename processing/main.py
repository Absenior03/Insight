import base64
import json
from google.cloud import firestore

# Initialize Firestore client
db = firestore.Client()

def process_log_entry(event, context):
    """
    Triggered from a message on a Cloud Pub/Sub topic.
    Args:
         event (dict): Event payload.
         context (google.cloud.functions.Context): Metadata for the event.
    """
    try:
        # Pub/Sub messages are base64-encoded
        pubsub_message_str = base64.b64decode(event['data']).decode('utf-8')
        print(f"Received raw message: {pubsub_message_str}")

        # The log entry from Cloud Logging is a JSON string itself.
        log_entry = json.loads(pubsub_message_str)
        
        # The actual log content is now nested inside the 'message' field of the jsonPayload
        if 'jsonPayload' in log_entry and 'message' in log_entry['jsonPayload']:
            payload = log_entry['jsonPayload']['message']
            # Ensure the payload is a dictionary, not a string
            if isinstance(payload, str):
                payload = json.loads(payload)
        else:
            print(f"Warning: Skipping log entry without a valid nested JSON payload. Entry: {log_entry}")
            return

        # Basic validation to ensure we have the fields we want
        if 'message' not in payload or 'level' not in payload or 'timestamp' not in payload:
            print(f"Warning: Skipping malformed payload: {payload}")
            return

        # Simple Anomaly Detection: Flag any log containing "exception" or "failed"
        message_lower = payload.get('message', '').lower()
        if 'exception' in message_lower or 'failed' in message_lower or 'denied' in message_lower:
            payload['is_anomaly'] = True
        else:
            payload['is_anomaly'] = False
            
        # Add the processed log to the 'processed-logs' collection in Firestore.
        doc_ref = db.collection('processed-logs').add(payload)
        
        print(f"Successfully processed and stored log with ID: {doc_ref[1].id}")

    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")