# There are two parts to the payload server

## Main server
- used to post and retrieve commands

## Secondary server
- used for malware clients to know when to start executing payloads

### Why the need of second server
Well querying the http server for commands every time is quite noisy so we make a udp server which is queried every 5 seconds for the existence of unexecuted payloads and if it returns a succesful response it starts querying the http server every second until it recives `no more commands response` and then querying the udpo server to see if we have closed the connection




