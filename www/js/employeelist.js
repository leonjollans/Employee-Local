var db;
var dbCreated = false;

var scroll = new iScroll('wrapper', { vScrollbar: false, hScrollbar:false, hScroll: false });

$(document).ready(function () {
    //if (!setup) setup();
});

function setup() {
    db = window.openDatabase("EmployeeDirectoryDB", "1.0", "PhoneGap Demo", 200000);
    if (dbCreated)
    	db.transaction(getEmployees, transaction_error);
    else
        db.transaction(populateDB, transaction_error, populateDB_success);

    $('#debug-info').empty();
    $('#debug-info').append('<li>jQuery:Available</li>');
    $('#debug-info').append('<li>db:' + (!db ? 'not' : '') + ' created </li>');
    $('#debug-info').append('<li>iScroll:' + (!scroll ? 'not' : '') + ' created </li>');
    $('#debug-info').append('<li>dbCreated: ' + dbCreated + '</li>');
}

function transaction_error(tx, error) {
	$('#busy').hide();
    alert("Database Error: " + error);
}

function populateDB_success() {
    db.transaction(getEmployees, transaction_error);
	dbCreated = true;
}

function getEmployees(tx) {
	var sql = "select e.id, e.firstName, e.lastName, e.title, e.picture, count(r.id) reportCount " + 
				"from employee e left join employee r on r.managerId = e.id " +
				"group by e.id order by e.lastName, e.firstName";
	tx.executeSql(sql, [], getEmployees_success);
}

function getEmployees_success(tx, results) {
	$('#busy').hide();
    var len = results.rows.length;
    for (var i=0; i<len; i++) {
    	var employee = results.rows.item(i);
		$('#employeeList').append('<li><a href="employeedetails.html?id=' + employee.id + '">' +
				'<img src="pics/' + employee.picture + '" class="list-icon"/>' +
				'<p class="line1">' + employee.firstName + ' ' + employee.lastName + '</p>' +
				'<p class="line2">' + employee.title + '</p>' +
				'<span class="bubble">' + employee.reportCount + '</span></a></li>');
    }
	setTimeout(function(){
		scroll.refresh();
	},100);
	db = null;
}

function populateDB(tx) {
	$('#busy').show();
	tx.executeSql('DROP TABLE IF EXISTS employee');
	var sql = 
		"CREATE TABLE IF NOT EXISTS employee ( "+
		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"firstName VARCHAR(50), " +
		"lastName VARCHAR(50), " +
		"title VARCHAR(50), " +
		"department VARCHAR(50), " + 
		"managerId INTEGER, " +
		"city VARCHAR(50), " +
		"officePhone VARCHAR(30), " + 
		"cellPhone VARCHAR(30), " +
		"email VARCHAR(30), " +
		"picture VARCHAR(200))";
    tx.executeSql(sql);

    tx.executeSql("INSERT INTO employee (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (12,'Leon','Jollans',4,'Software Architect','Engineering','617-000-0012','781-000-0012','swells@fakemail.com','Boston, MA','steven_wells.jpg')");
    tx.executeSql("INSERT INTO employee (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (11,'Cheesy','Bellend',5,'Sales Representative','Sales','617-000-0011','781-000-0011','ajones@fakemail.com','Boston, MA','amy_jones.jpg')");
}
