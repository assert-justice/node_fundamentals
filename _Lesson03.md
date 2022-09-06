# Executing Subprocesses
We run a lot of commands a lot of times in the terminal. How many times have you typed the following:
```
git add .
git commit -m "some message"
git push
```
A lot right? Wouldn't it be nice if it was a single command? Well guess what, we can use JS to issue regular console commands like that.

## Modern Operating Systems, Hilariously Simplified
Every program running on your computer is what we call a process. An executable somewhere is ticking along and eventually that process ends. When it does it returns a status code. By convention a process returns 0 to indicate everything is copacetic, and a non zero value if something went wrong.