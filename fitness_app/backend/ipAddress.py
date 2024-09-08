#get local IP address
#tutorial from https://www.w3resource.com/python-exercises/python-basic-exercise-55.php

import socket

local_hostname = socket.gethostname()
ip_addresses = socket.gethostbyname_ex(local_hostname)[2]
filtered_ips = [ip for ip in ip_addresses if not ip.startswith("127.")]
first_ip = filtered_ips[:1]

if first_ip:
    ip_address = first_ip[0] 
    js_content = f"""
export const LOCAL_IP = '{ip_address}';
"""
else:
    ip_address = None
    js_content = "export const LOCAL_IP = 'undefined';"

if __name__ == "__main__":
    ip_address = first_ip[0]
    if ip_address:
        print(f"Your IP address is: {ip_address}")
        #save the IP address to a js file
        with open('ipLocal.js', 'w') as js_file:
            js_file.write(js_content)
    else:
        print("Could not retrieve IP address.")
