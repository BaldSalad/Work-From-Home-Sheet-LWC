public with sharing class ScheduleController {
    @AuraEnabled(cacheable=true)
    public static List<User> getUsersWorkSchedule() {
        return [
            SELECT 
                Id, 
                Name, 
                DaysInOffice__c, 
                DaysInOffice2__c, 
                DaysInOffice3__c, 
                DaysInOffice4__c, 
                DaysInOffice5__c, 
                DaysInOfficeW2__c, 
                DaysInOffice2w2__c, 
                DaysInOffice3w2__c, 
                DaysInOffice4w2__c, 
                DaysInOffice5w2__c,
                FullPhotoUrl,
                MediumPhotoUrl,
                SmallPhotoUrl
            FROM User 
            WHERE IsActive = true
        ];
    }

    @AuraEnabled
    public static void saveUsersWorkSchedule(List<User> updatedUsers) {

            update updatedUsers;
        
    }
}
