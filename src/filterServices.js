// Filter Service Logic
const FilterServices = {
    // Filter by location
    filterByLocation: function(providers, location) {
        if (!location) return providers;
        return providers.filter(provider => 
            provider.Location && provider.Location.toLowerCase().includes(location.toLowerCase())
        );
    },

    // Filter by service type
    filterByService: function(providers, service) {
        if (!service) return providers;
        return providers.filter(provider => 
            provider.Service && provider.Service.toLowerCase().includes(service.toLowerCase())
        );
    },

    // Filter by price range
    filterByPriceRange: function(providers, minPrice, maxPrice) {
        return providers.filter(provider => {
            const rate = provider.HourlyRate;
            if (!minPrice && !maxPrice) return true;
            if (!minPrice) return rate <= maxPrice;
            if (!maxPrice) return rate >= minPrice;
            return rate >= minPrice && rate <= maxPrice;
        });
    },

    // Filter by experience
    filterByExperience: function(providers, minExperience) {
        if (!minExperience) return providers;
        return providers.filter(provider => 
            provider.YearsOfExperience >= minExperience
        );
    },

    // Apply all filters
    applyFilters: function(providers, filters) {
        let filteredProviders = providers;

        // Apply location filter
        if (filters.location) {
            filteredProviders = this.filterByLocation(filteredProviders, filters.location);
        }

        // Apply service filter
        if (filters.service) {
            filteredProviders = this.filterByService(filteredProviders, filters.service);
        }

        // Apply price range filter
        if (filters.minPrice || filters.maxPrice) {
            filteredProviders = this.filterByPriceRange(
                filteredProviders, 
                filters.minPrice, 
                filters.maxPrice
            );
        }

        // Apply experience filter
        if (filters.minExperience) {
            filteredProviders = this.filterByExperience(filteredProviders, filters.minExperience);
        }

        return filteredProviders;
    },

    // Generate card HTML for provider
    generateProviderCard: function(provider) {
        return `
            <div class="card shadow-sm border-0 mb-4" style="width: 18rem;">
                <div class="card-header bg-primary text-white py-3">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-user-circle me-2"></i>${provider.UserName}
                    </h5>
                </div>
                <div class="card-body bg-light">
                    <p class="card-text"><strong>Service:</strong> ${provider.Service || "Not Provided"}</p>
                    <p class="card-text"><strong>Experience:</strong> ${provider.YearsOfExperience || 0} years</p>
                    <p class="card-text"><strong>Rate:</strong> $${provider.HourlyRate || 0}/hr</p>
                    <p class="card-text"><strong>Location:</strong> ${provider.Location || "Not Provided"}</p>
                    <p class="card-text"><strong>Email:</strong> ${provider.Email || "Not Provided"}</p>
                    <p class="card-text"><strong>Mobile:</strong> ${provider.Mobile || "Not Provided"}</p>
                    <button class="btn btn-primary contact-btn" data-email="${provider.Email}">Contact</button>
                </div>
            </div>
        `;
    },

    // Update UI with filtered providers
    updateProvidersUI: function(providers) {
        const providersContainer = $("#providersContainer");
        providersContainer.empty();

        if (providers.length === 0) {
            providersContainer.html('<p class="text-center">No service providers found matching your criteria.</p>');
            return;
        }

        providers.forEach(provider => {
            providersContainer.append(this.generateProviderCard(provider));
        });
    }
};

// Export the FilterServices object
window.FilterServices = FilterServices;
