import { LightningElement, track, wire } from 'lwc';
import getUsersWorkSchedule from '@salesforce/apex/ScheduleController.getUsersWorkSchedule';
import saveUsersWorkSchedule from '@salesforce/apex/ScheduleController.saveUsersWorkSchedule';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class WorkSchedule extends LightningElement {
    @track users = [];
    @track dayOptions = [
        { label: 'Office', value: 'Office' },
        { label: 'WFH', value: 'WFH' },
        { label: 'Annual Leave', value: 'Annual Leave' },
        { label: 'Event', value: 'Event' },
    ];

    weekStart;
    weekEnd;
    weekStartFormatted;
    weekEndFormatted;
    weekStartDate;
    weekEndDate;
    weekStartNext;
    weekEndNext;
    weekStartNextFormatted;
    weekEndNextFormatted;

    dayFields = [
        'DaysInOffice__c', 'DaysInOffice2__c', 'DaysInOffice3__c', 'DaysInOffice4__c', 'DaysInOffice5__c',
        'DaysInOfficeW2__c', 'DaysInOffice2w2__c', 'DaysInOffice3w2__c', 'DaysInOffice4w2__c', 'DaysInOffice5w2__c'
    ];

    connectedCallback() {
        this.setWeekDates();
    }

    @wire(getUsersWorkSchedule)
    wiredUsers({ error, data }) {
        if (data) {
            this.users = data;   
        } else if (error) {
            console.error('Error fetching user schedules:', error);
        }
    }

    setWeekDates() {
        const today = new Date();
        const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1));
        const friday = new Date(monday);
        friday.setDate(monday.getDate() + 4);

        this.weekStart = monday;
        this.weekEnd = friday;
        this.weekStartDate = monday.getDate();
        this.weekEndDate = friday.getDate();

        this.weekStartNext = new Date(monday);
        this.weekStartNext.setDate(monday.getDate() + 7);
        this.weekEndNext = new Date(friday);
        this.weekEndNext.setDate(friday.getDate() + 7);

        this.weekStartFormatted = this.getMonthAbbreviation(this.weekStart);
        this.weekEndFormatted = this.getMonthAbbreviation(this.weekEnd);
        this.weekStartNextFormatted = this.getMonthAbbreviation(this.weekStartNext);
        this.weekEndNextFormatted = this.getMonthAbbreviation(this.weekEndNext);
    }

    getMonthAbbreviation(date) {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('default', { month: 'short', day: 'numeric' });
    }

    handleChange(event) {
        const userId = event.target.dataset.userId;
        const dayField = event.target.dataset.dayField;
        const value = event.detail.value;

        const userIndex = this.users.findIndex(u => u.Id === userId);
        if (userIndex !== -1) {
            const updatedUser = { ...this.users[userIndex] };
            updatedUser[dayField] = value;

            this.users = [
                ...this.users.slice(0, userIndex),
                updatedUser,
                ...this.users.slice(userIndex + 1),
            ];
        } 
    }


    handleSave() {
        const updatedUsers = this.users.filter(user => 
            this.dayFields.some(field => user[field] !== this.users.find(u => u.Id === user.Id)[field])
        );

        console.log('Saving updated users:', updatedUsers);

        saveUsersWorkSchedule({ updatedUsers: updatedUsers })
            .then(() => {
                console.log('User schedules saved successfully!');
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Work from home has been updated',
                        variant: 'success',
                    })
                );
            })
            .catch(error => {
                console.error('Error saving user schedules:', error);
            });
    }

    getCellClass(user, dayField) {
        const value = user[dayField];
        if (value === 'Office') return 'office';
        if (value === 'WFH') return 'wfh';
        if (value === 'Annual Leave') return 'annual-leave';
        if (value === 'Event') return 'event';
        return '';
    }

    get usersWithClasses() {
        return this.users.map(user => {
            const dayClasses = {};
            this.dayFields.forEach(field => {
                dayClasses[field] = this.getCellClass(user, field);
            });
            return { ...user, dayClasses };
        });
    }
    
    @wire(getUsersWorkSchedule)
    wiredUsers({ data, error }) {
        if (data) {
            this.users = data.map(user => {
                const smallPhotoUrl = user.SmallPhotoUrl;
                return {
                    ...user, 
                    SmallPhotoUrl: smallPhotoUrl
                };
            });
            this.error = undefined; 
        } else if (error) {
            this.error = error; 
            this.users = undefined; 
            console.error('Error fetching user photos:', error);
        }
    }

  
}
