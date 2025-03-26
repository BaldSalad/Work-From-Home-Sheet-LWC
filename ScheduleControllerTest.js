@isTest
public class ScheduleControllerTest {

    @isTest
    static void testGetUsersWorkSchedule() {
        // Retrieve the Profile for 'System Administrator'
        Profile sysAdminProfile = [SELECT Id FROM Profile WHERE Name = 'System Administrator' LIMIT 1];
        
        // Create a new User with the required fields
        User testUser = new User(
            Username = 'testuser123@testemail.co.uk',
            Email = 'testuser123@testemail.co.uk',
            Alias = 'testuser',
            ProfileId = sysAdminProfile.Id,
            LastName = 'Test', // Adding a last name as it is required
            EmailEncodingKey = 'UTF-8', // Adding EmailEncodingKey
            DaysInOffice__c = 'Event',
            DaysInOffice2__c = 'Annual Leave',
            DaysInOffice3__c = 'Event',
            DaysInOffice4__c = 'Event',
            DaysInOffice5__c = 'Event',
            IsActive = true,
            TimeZoneSidKey = 'America/New_York',
            LocaleSidKey = 'en_US',
            LanguageLocaleKey = 'en_US'
        );

        insert testUser;

        Test.startTest();

        List<User> users = ScheduleController.getUsersWorkSchedule();

        System.assertNotEquals(0, users.size(), 'The list of users should not be empty');

        Test.stopTest();
    }

    @isTest
    static void testSaveUsersWorkSchedule() {
        // Retrieve the Profile for 'System Administrator'
        Profile sysAdminProfile = [SELECT Id FROM Profile WHERE Name = 'System Administrator' LIMIT 1];

        // Create a new User with the required fields
        User testUser = new User(
            Username = 'testuser123@testemail.co.uk',
            Email = 'testuser123@testemail.co.uk',
            Alias = 'testuser',
            ProfileId = sysAdminProfile.Id,
            LastName = 'Test', // Adding a last name as it is required
            EmailEncodingKey = 'UTF-8', // Adding EmailEncodingKey
            DaysInOffice__c = 'Event',
            DaysInOffice2__c = 'Annual Leave',
            DaysInOffice3__c = 'Event',
            DaysInOffice4__c = 'Event',
            DaysInOffice5__c = 'Event',
            IsActive = true,
            TimeZoneSidKey = 'America/New_York',
            LocaleSidKey = 'en_US',
            LanguageLocaleKey = 'en_US'
        );

        insert testUser;

        testUser.DaysInOffice__c = 'Office';
        testUser.DaysInOffice4__c = 'Event';
        testUser.DaysInOffice5__c = 'Event';

        Test.startTest();

        List<User> updatedUsers = new List<User>{testUser};
        ScheduleController.saveUsersWorkSchedule(updatedUsers);

        User updatedUser = [SELECT Id, DaysInOffice__c, DaysInOffice2__c, DaysInOffice3__c, DaysInOffice4__c, DaysInOffice5__c 
                            FROM User WHERE Id = :testUser.Id];
        
        System.assertEquals('Office', updatedUser.DaysInOffice__c, 'DaysInOffice__c should be updated');
        System.assertEquals('Event', updatedUser.DaysInOffice4__c, 'DaysInOffice4__c should remain the same');
        System.assertEquals('Event', updatedUser.DaysInOffice5__c, 'DaysInOffice5__c should remain the same');

        Test.stopTest();
    }
}
