# BUDGET BONDS

<br/>

## RELATIONAL DESIGN 
---

<br/>
<br/>
For Unauthenticated Users 

<br/>

**TABLE NAME =>** unauthentic_users
<table>
<tr>
    <th>email</th>
    <th>confirmation_code</th>
    <th>signup_time</th>
</tr>
</table>


<br/>
<br/>
For Authenticated Users 
<br/>

**TABLE NAME =>** authentic_users
<table>
<tr>
    <th>username</th>
    <th>email</th>
    <th>user_password</th>
</tr>
</table>



<br/>
<br/>
For Groups
<br/>

<table>
<tr>
    <th>GroupName</th>
    <th>GroupID</th>
    <th>MadeBy</th>
    <th>Icon</th>
</tr>
</table>



<br/>
<br/>
Group Requests
<br/>

<table>
<tr>
    <th>GroupID</th>
    <th>Username</th>
</tr>
</table>



<br/>
<br/>
Group Members
<br/>

<table>
<tr>
    <th>GroupID</th>
    <th>Username</th>
    <th>IsInGroup</th>
    <th>Spent</th>
    <th>Paid</th>
</tr>
</table>



<br/>
<br/>
Activities
<br/>

<table>
<tr>
    <th>GroupID</th>
    <th>ActivityID</th>
    <th>ActivityName</th>
    <th>ActivityType</th>
    <th>InsertedBy</th>
    <th>DateTime</th>
    <th>IsPersonal</th>
</tr>
</table>




<br/>
<br/>
Activity Expenses
<br/>

<table>
<tr>
    <th>ActivityID</th>
    <th>Username</th>
    <th>Paid</th>
    <th>Spent</th>
    <th>Income</th>
</tr>
</table>




<br/>
<br/>
Logs
<br/>

<table>
<tr>
    <th>GroupID</th>
    <th>LogBy</th>
    <th>LogFor</th>
    <th>DateTime</th>
    <th>Log</th>
</tr>
</table>




<br/>
<br/>
Announcement
<br/>

<table>
<tr>
    <th>GroupID</th>
    <th>AnnouncementBy</th>
    <th>DateTime</th>
    <th>Announcement</th>
</tr>
</table>




<br/>
<br/>
Settles
<br/>

<table>
<tr>
    <th>GroupID</th>
    <th>ActivityID</th>
    <th>PayAmount</th>
    <th>PayTo</th>
    <th>PayBy</th>
    <th>IsSettled</th>
</tr>
</table>