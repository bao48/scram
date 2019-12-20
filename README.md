# scram
Personal Scrum Board

### How do I run this?
I haven't exported this yet so you will need to download npm/node & electron. In your desired folder, clone the repository, then run the following commmands.
```
npm init
npm install --save-dev electron
```


### Where is my data stored?
Electron stores data in an App Data folder. This is where the data should be stored:
* **Linux**: ~/.config/<App Name>
* **Mac OS**: ~/Library/Application Support/<App Name>
* **Windows**: C:\Users\<user>\AppData\Local\<App Name>

To get the correct folder, we can use: ```app.getPath(userData)```. Full documentation [here](https://github.com/electron/electron/blob/master/docs/api/app.md#appgetpathname).
