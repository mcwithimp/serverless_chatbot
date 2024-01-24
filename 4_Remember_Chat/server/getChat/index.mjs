import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient({});

export const handler = async function (event) {
  try {
    const command = new ScanCommand({
      TableName: "chat-messages",
      ProjectionExpression: "id, sender, #TXT, #TIME",
      // 'text' is a reserved keyword
      ExpressionAttributeNames: {
        "#TXT": "text",
        "#TIME": "timestamp",
      },
    });
    const result = await client.send(command);
    const items =
      result.Items?.map((item) => {
        return {
          id: Number(item.id.N),
          sender: item.sender.S,
          text: item.text.S,
          timestamp: Number(item.timestamp.N),
        };
      }) || [];
    return done(null, items);
  } catch (err) {
    return done(err);
  }
};

function done(err, res) {
  if (err) {
    console.error(err);
  }
  return {
    statusCode: err ? "400" : "200",
    body: err ? JSON.stringify(err) : JSON.stringify(res),
    headers: {
      "Content-Type": "application/json",
    },
  };
}
