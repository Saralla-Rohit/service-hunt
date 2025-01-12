// // Filter Service Logic
// const ServiceFilters = {
//     // Filter by service type
//     filterByService: function(providers, service) {
//         if (!service) return providers;
//         return providers.filter(provider => 
//             provider.Service && provider.Service.toLowerCase().includes(service.toLowerCase())
//         );
//     },

//     // Filter by price range
//     filterByPriceRange: function(providers, minPrice, maxPrice) {
//         return providers.filter(provider => {
//             const rate = provider.HourlyRate;
//             if (!minPrice && !maxPrice) return true;
//             if (!minPrice) return rate <= maxPrice;
//             if (!maxPrice) return rate >= minPrice;
//             return rate >= minPrice && rate <= maxPrice;
//         });
//     },

//     // Filter by experience
//     filterByExperience: function(providers, minExperience) {
//         if (!minExperience) return providers;
//         return providers.filter(provider => 
//             provider.YearsOfExperience >= minExperience
//         );
//     },

//     // Apply additional filters to location-filtered results
//     applyAdditionalFilters: function(providers, filters) {
//         let filteredProviders = providers;

//         // Apply service filter
//         if (filters.service) {
//             filteredProviders = this.filterByService(filteredProviders, filters.service);
//         }

//         // Apply price range filter
//         if (filters.minPrice || filters.maxPrice) {
//             filteredProviders = this.filterByPriceRange(
//                 filteredProviders, 
//                 filters.minPrice, 
//                 filters.maxPrice
//             );
//         }

//         // Apply experience filter
//         if (filters.minExperience) {
//             filteredProviders = this.filterByExperience(filteredProviders, filters.minExperience);
//         }

//         return filteredProviders;
//     },

//     // Update UI with filtered providers
//     updateProvidersUI: function(providers) {
//         const profilesContainer = $("#profilesContainer");
//         profilesContainer.empty();

//         if (providers.length === 0) {
//             profilesContainer.html('<p class="text-center">No service providers found matching your criteria.</p>');
//             return;
//         }

//         providers.forEach(provider => {
//             const cardBody = `
//                 <div class="card shadow-sm border-0 mb-4" style="width: 18rem;">
//                     <div class="card-header bg-primary text-white py-3">
//                         <h5 class="card-title mb-0">
//                             <i class="fas fa-user-circle me-2"></i>${provider.UserName}
//                         </h5>
//                     </div>
//                     <div class="card-body bg-light">
//                         <p class="card-text">Service: <span class="service-text">${provider.Service || "Not Provided"}</span></p>
//                         <p class="card-text">Experience: <span class="experience-text">${provider.YearsOfExperience || 0}</span> years</p>
//                         <p class="card-text">Rate: $<span class="rate-text">${provider.HourlyRate || 0}</span>/hr</p>
//                         <p class="card-text">Location: <span class="location-text">${provider.Location || "Not Provided"}</span></p>
//                         <p class="card-text">Email: <span class="email-text">${provider.Email || "Not Provided"}</span></p>
//                         <p class="card-text">Mobile: <span class="mobile-text">${provider.Mobile || "Not Provided"}</span></p>
//                         <button class="btn btn-info contact-btn">Contact</button>
//                     </div>
//                 </div>
//             `;
//             profilesContainer.append(cardBody);
//         });
//     }
// };

// // Export the ServiceFilters object
// window.ServiceFilters = ServiceFilters;
