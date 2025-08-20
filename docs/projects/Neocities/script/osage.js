 function calculateOSAge() {
            // Installation date: June 9, 2025
            const installDate = new Date('2025-06-09');
            const currentDate = new Date();
            
            // Calculate difference in milliseconds
            const timeDifference = currentDate - installDate;
            
            // Convert to days
            const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            
            // Format the output
            let ageText;
            if (daysDifference < 0) {
                ageText = "not installed yet";
            } else if (daysDifference === 0) {
                ageText = "fresh install!";
            } else if (daysDifference === 1) {
                ageText = "1 day";
            } else if (daysDifference < 30) {
                ageText = `${daysDifference} days`;
            } else if (daysDifference < 365) {
                const months = Math.floor(daysDifference / 30);
                const remainingDays = daysDifference % 30;
                if (remainingDays === 0) {
                    ageText = months === 1 ? "1 month" : `${months} months`;
                } else {
                    ageText = months === 1 ? `1 month, ${remainingDays} days` : `${months} months, ${remainingDays} days`;
                }
            } else {
                const years = Math.floor(daysDifference / 365);
                const remainingDays = daysDifference % 365;
                const months = Math.floor(remainingDays / 30);
                const days = remainingDays % 30;
                
                let parts = [];
                if (years > 0) parts.push(years === 1 ? "1 year" : `${years} years`);
                if (months > 0) parts.push(months === 1 ? "1 month" : `${months} months`);
                if (days > 0) parts.push(days === 1 ? "1 day" : `${days} days`);
                
                ageText = parts.join(", ");
            }
            
            // Update the display
            document.getElementById('os-age').textContent = ageText;
        }
        
        // Calculate OS age when page loads
        document.addEventListener('DOMContentLoaded', calculateOSAge);
        
        // Update every hour to keep it current
        setInterval(calculateOSAge, 3600000); // 3600000 ms = 1 hour